# Routing Standards

This document outlines the coding standards and requirements for routing in the Workout Diary application.

## Protected Routes

All routes and sub-routes in this application **must be protected routes**. Every page accessed through these routes should only be accessible to logged-in users.

### Middleware-Based Route Protection

Route protection **must be implemented using Next.js middleware**. The middleware should:

- Intercept all incoming requests before they reach page handlers
- Verify user authentication status
- Redirect unauthenticated users to the login/sign-in page
- Allow authenticated users to proceed to their intended destination

### Implementation Requirements

1. **Middleware Configuration**
   - Create a `middleware.ts` file in the root or `src/` directory
   - Configure the matcher to include all routes that should be protected
   - Exclude public routes (auth, landing pages) from the matcher

2. **Authentication Checks**
   - Verify user session/token validity
   - Check for required authentication headers or cookies
   - Implement proper error handling for authentication failures

3. **Redirect Logic**
   - Unauthenticated users should be redirected to sign-in page
   - Preserve the intended destination for post-login redirect
   - Handle edge cases like expired sessions

4. **Route Structure**
   - All application pages should be nested under protected routes
   - Public routes (login, register, forgot password) should be explicitly excluded
   - Dynamic routes must follow the same protection pattern

### Example Route Structure

```
/app
  /auth          # Public routes (login, register)
    /login
    /register
  /dashboard     # Protected routes
    /exercises
    /workouts
    /profile
```

### Best Practices

- Use TypeScript for type safety in middleware
- Implement proper error logging for authentication failures
- Consider adding rate limiting for auth endpoints
- Ensure middleware is efficient and doesn't block legitimate requests
- Test middleware behavior with various authentication scenarios