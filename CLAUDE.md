# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A reference architecture demonstrating API Gateway v1 authorization using a custom Lambda authorizer with Cognito JWTs plus API Key enforcement for rate limiting. The authorizer validates tokens (existence, signature, expiry); the API Key gates access and tracks usage via a usage plan. This is a Serverless Framework project deployed to AWS.

## Commands

```bash
npm test              # lint + unit tests (runs pre-commit too)
npm run test:unit     # unit tests only
npm run test:int      # integration tests (requires deployed stack + AWS creds)
npm run test:e2e      # E2E tests (requires deployed stack + AWS creds)
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run prettier      # Prettier format all files
npm run deploy        # Deploy via Serverless Framework
npm run teardown      # Remove deployed stack
```

To run a single test file:

```bash
npx jest src/hello/test/hello.unit.test.js --silent
npx jest src/authorizer/test/service.int.test.js --config jest.config.int.js --silent
```

## Test Tiers

**Unit** (`*.unit.test.js`) — pure in-process, no AWS access needed.

**Integration** (`*.int.test.js`, `jest.config.int.js`) — calls the deployed stack directly (bypasses API Gateway, hits Lambda/Cognito). Setup in `common/test/jest.setup.int.js` bootstraps `USER_POOL_ID` and `ACCESS_TOKEN` from the live CloudFormation stack.

**E2E** (`*.e2e.test.js`, `jest.config.e2e.js`) — full round-trip through API Gateway. Setup in `common/test/jest.setup.e2e.js` also fetches `API_URL` and `API_KEY`. CI pipeline: deploy → int → e2e → teardown.

## Architecture

```
API Gateway (REST v1)
  └── GET /hello  [private: true, authorizer: authorizerFunc]
        ├── authorizerFunc Lambda  (src/authorizer/)
        │     └── Validates Bearer JWT via CognitoJwtVerifier
        │         Returns Allow/Deny IAM policy
        └── helloWorld Lambda  (src/hello/)
              └── Returns { message: "Hello World!" }

Cognito User Pool  (infrastructure/cognito.yml)
  └── UserPoolResourceServer  (scope: client-credentials-flow-demo/hello.*)
  └── IntegrationTestClient   (client_credentials flow, generates tokens for tests)

API Gateway Usage Plan  (serverless.yml)
  └── ApiKey: IntegrationTestClient  (x-api-key header required)
```

The authorizer flow: extract `Bearer <token>` → `jwt.decode` to get `client_id` → create `CognitoJwtVerifier` for that pool/client → `verifier.verify()` → return Allow policy or throw `"Unauthorized"` (becomes 401 in API Gateway).

## Key Conventions

- **ESM** (`import`/`export`) throughout — Jest transforms via `@swc/jest`.
- **Middy** wraps all Lambda handlers; `ioLogger` middleware is applied to both functions via `middyIoLoggerConfiguration.js` which uses `@aws-lambda-powertools/logger`.
- **`max-params: 1`** lint rule — functions take a single options object, not positional args.
- **`no-param-reassign`** — no mutating parameters.
- **`no-only-tests`** — `.only` is a lint error; CI will catch it.
- The `moduleNameMapper` in `jest.config.js` maps `#node-web-compat` for `aws-jwt-verify`'s internal ESM subpath — don't remove it.
- Test setup utilities (`common/test/setupUtils.js`) pull stack outputs from CloudFormation and fetch a real Cognito access token via client credentials flow before int/e2e tests run.

## Deployment

Stack name pattern: `api-v1-auth-{stage}` (default stage: `dev`). The CloudFormation stack exports `ApiV1AuthUserPoolId`, `ApiV1AuthUserPoolDomain`, `ApiV1AuthTestClientId`, and `ServiceEndpoint` — all consumed by test setup utilities.
