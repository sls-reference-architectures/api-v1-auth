# api-v1-auth

A reference architecture for ApiGtwy v1 auth

## Authorizer

Validates that the caller has a valid (existent, properly-signed, properly-scoped, non-expired) JWT.

### Test Cases

1. Caller has valid token (SUCCESS)
2. Caller has no token (FAILURE)
3. Caller does use "Bearer" scheme (FAILURE)
4. Caller has a non-signed token (FAILURE)
5. Caller has a signed-but-expired token (FAILURE)
