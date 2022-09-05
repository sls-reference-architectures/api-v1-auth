# api-v1-auth

A reference architecture for ApiGateway v1 Authorization

This project demonstrates both a custom Lambda authorizer to validate JWT and how to generate & use API Keys for usage tracking. AWS (and I) recommend you not rely on the API Key for authZ and authN. Use it for rate limiting via a usage plan.

## Authorizer

Validates that the caller has a valid (existent, properly-signed, non-expired) JWT.

## API Key

Ensures that only callers providing a valid API Key can use the API method. Tracks the caller's usage over time how much of his usage plan capacity remains.

### Test Cases

1. Caller has valid token (SUCCESS)
2. Caller has no token (FAILURE)
3. Caller does use "Bearer" scheme (FAILURE)
4. Caller has a non-signed token (FAILURE)
5. Caller has a signed-but-expired token (FAILURE)
