# Authentication Guidelines

## Overview

**Workout Diary uses Clerk for complete authentication and user management.** This system handles user registration, sign-in/out, session management, and protected routes throughout the application.

## Core Authentication Architecture

### 1. Authentication Provider
**ClerkProvider wraps the entire application** in `app/layout.tsx`:
```tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 2. Authentication Components
**Clerk components provide sign-in/sign-up functionality:**

#### SignedOut Components (Public Access)
```tsx
<SignedOut>
  <Button variant="default" size="sm" asChild>
    <SignInButton mode="modal">
      Sign In
    </SignInButton>
  </Button>
  <Button variant="secondary" size="sm" asChild>
    <SignUpButton mode="modal">
      Sign Up
    </SignUpButton>
  </Button>
</SignedOut>
```

#### SignedIn Components (Authenticated Users)
```tsx
<SignedIn>
  <UserButton afterSignOutUrl="/" />
</SignedIn>
```

## Authentication Patterns

### 1. Server Components Authentication
**Mandatory pattern for protected pages:**
```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Continue with authenticated user logic
  const userData = await getUserData(userId);
  return <UserDashboard userData={userData} />;
}
```

### 2. Client Components Authentication
**For user interactions and client-side state:**
```tsx
'use client'
import { useUser } from "@clerk/nextjs";

export function UserProfile() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return <p>Please sign in to view your profile.</p>;
  }

  return <div>Welcome, {user?.firstName}!</div>;
}
```

### 3. Mixed Authentication Pattern
**Server component with client component children:**
```tsx
// Server Component
export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const workouts = await getUserWorkouts(userId);
  return <DashboardClient workouts={workouts} />;
}

// Client Component
'use client'
export function DashboardClient({ workouts }) {
  const { user } = useUser();
  // Client-side interactions with authenticated user data
}
```

## Required Environment Variables

### .env.local Configuration
```bash
# Clerk Authentication Keys (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Clerk Development URLs (Optional for development)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Clerk Dashboard Configuration
1. **Create Clerk Project**: Set up new project at [Clerk Dashboard](https://dashboard.clerk.com)
2. **Configure Application**: Add your development URL (`http://localhost:3000`)
3. **Copy Keys**: Add publishable and secret keys to `.env.local`
4. **Configure Sessions**: Set session redirect URLs for your application flow

## Implementation Standards

### 1. Import Patterns
**Always use correct Clerk imports:**

#### Server Components
```tsx
import { auth } from "@clerk/nextjs/server";
```

#### Client Components
```tsx
import { useUser, useAuth } from "@clerk/nextjs";
```

#### UI Components
```tsx
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";
```

### 2. User ID Extraction
**Critical for database operations:**
```tsx
// ✅ CORRECT: Server Component User ID
const { userId } = await auth();

// ✅ CORRECT: Client Component User ID
const { userId } = useAuth();

// ❌ WRONG: Never use user.id directly for database operations
const { user } = useUser();
const userId = user.id; // Use useAuth() instead
```

### 3. Route Protection Pattern
**Standard protected route implementation:**
```tsx
export default async function ProtectedRoute() {
  const { userId } = await auth();

  if (!userId) {
    // Redirect to home page for unauthenticated users
    redirect("/");
  }

  // User is authenticated - proceed with page logic
  const userData = await getUserData(userId);

  return <ProtectedComponent userData={userData} />;
}
```

## Security Requirements

### 1. User Data Isolation
**CRITICAL: All database operations must filter by userId:**
```tsx
// ✅ CORRECT: User-filtered data access
export async function getUserWorkouts(userId: string) {
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}

// ❌ WRONG: No user filtering (Security Risk)
export async function getAllWorkouts() {
  return await db.select().from(workouts);
}
```

### 2. Authentication State Management
**Proper handling of authentication states:**
```tsx
// ✅ CORRECT: Handle unauthenticated state
export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/"); // Clear redirect for unauthenticated users
  }

  // Continue with authenticated logic
}

// ❌ WRONG: Assume user is authenticated
export default async function Dashboard() {
  const { userId } = await auth(); // Could be null/undefined
  const workouts = await getUserWorkouts(userId); // Security risk!
}
```

### 3. Client-Side Security
**Never trust client-side authentication:**
```tsx
// ✅ CORRECT: Use server components for sensitive data
export default async function ProfilePage() {
  const { userId } = await auth();
  const profile = await getUserProfile(userId);
  return <ProfileClient profile={profile} />;
}

// ❌ WRONG: Client-side data fetching
'use client'
function ProfileClient() {
  const { userId } = useAuth();
  const [profile, setProfile] = useState();

  useEffect(() => {
    fetch('/api/profile', { userId }) // FORBIDDEN
      .then(setProfile);
  }, [userId]);
}
```

## User Interface Components

### 1. Navigation Authentication
**Header authentication pattern from layout.tsx:**
```tsx
<header className="p-4 border-b">
  <div className="max-w-7xl mx-auto flex justify-between items-center">
    <h1 className="text-2xl font-bold">Workout Diary</h1>
    <div className="flex gap-4 items-center">
      <SignedOut>
        <Button variant="default" size="sm" asChild>
          <SignInButton mode="modal">
            Sign In
          </SignInButton>
        </Button>
        <Button variant="secondary" size="sm" asChild>
          <SignUpButton mode="modal">
            Sign Up
          </SignUpButton>
        </Button>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  </div>
</header>
```

### 2. Sign-in/Up Modal
**Modal-based authentication:**
```tsx
<SignInButton mode="modal">
  <Button>Sign In</Button>
</SignInButton>

<SignUpButton mode="modal">
  <Button variant="outline">Sign Up</Button>
</SignUpButton>
```

### 3. User Profile Menu
**UserButton for authenticated users:**
```tsx
<SignedIn>
  <UserButton
    afterSignOutUrl="/"
    appearance={{
      elements: {
        avatarBox: "w-10 h-10",
      }
    }}
  />
</SignedIn>
```

## Error Handling

### 1. Authentication Errors
**Handle authentication failures gracefully:**
```tsx
export default async function ProtectedPage() {
  const { userId } = await auth();

  if (!userId) {
    // Clear redirect to home page
    redirect("/");
  }

  try {
    const userData = await getUserData(userId);
    return <Dashboard data={userData} />;
  } catch (error) {
    // Handle database or other errors
    console.error('Failed to load user data:', error);
    redirect("/error"); // Optional error page
  }
}
```

### 2. Client-Side Authentication States
**Proper handling in client components:**
```tsx
'use client'
export function UserProfile() {
  const { isSignedIn, isLoaded, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>; // Loading state
  }

  if (!isSignedIn) {
    return <div>Please sign in to view your profile.</div>;
  }

  return <div>Welcome, {user?.firstName}!</div>;
}
```

## Testing Authentication

### 1. Development Testing
**Local authentication testing:**
```bash
# Start development server
npm run dev

# Test authentication flow:
# 1. Visit http://localhost:3000
# 2. Click "Sign Up" to create test account
# 3. Verify email if required
# 4. Test sign-in/out functionality
# 5. Access protected routes (/dashboard)
```

### 2. Clerk Dashboard Testing
**Test user management:**
1. **Visit Clerk Dashboard**: [dashboard.clerk.com](https://dashboard.clerk.com)
2. **View Users**: Check created test users
3. **Test Sessions**: Monitor active sessions
4. **Configure Settings**: Adjust authentication requirements

### 3. Protected Route Testing
**Verify route protection:**
```bash
# Test unauthenticated access
curl http://localhost:3000/dashboard
# Should redirect to home page

# Test authenticated access
# 1. Sign in through UI
# 2. Access /dashboard
# 3. Should load user-specific data
```

## Advanced Features

### 1. Custom Authentication Pages
**Optional: Override default Clerk pages:**
```tsx
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn path="/sign-in" />
    </div>
  );
}

// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp path="/sign-up" />
    </div>
  );
}
```

### 2. Middleware Configuration
**Optional: Custom middleware for route protection:**
```tsx
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/workouts(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### 3. User Metadata
**Store additional user data in Clerk metadata:**
```tsx
'use client'
import { useUser } from "@clerk/nextjs";

export function UserPreferences() {
  const { user } = useUser();

  const preferences = user?.publicMetadata?.preferences || {};

  return <div>User preferences: {JSON.stringify(preferences)}</div>;
}
```

## Troubleshooting

### 1. Common Issues

#### Environment Variables Not Working
```bash
# Verify .env.local exists and contains correct keys
cat .env.local

# Restart development server after changes
npm run dev
```

#### Authentication Not Working in Production
1. **Check Domain Configuration**: Add production URL to Clerk dashboard
2. **Verify HTTPS**: Clerk requires HTTPS in production
3. **Update Keys**: Use production keys, not test keys

#### User Data Not Loading
1. **Check userId extraction**: Verify `auth()` returns valid userId
2. **Database connection**: Ensure database operations work with userId
3. **User filtering**: Confirm all queries filter by userId

### 2. Debug Authentication
**Debug authentication state:**
```tsx
export default async function DebugPage() {
  const authData = await auth();
  console.log('Auth data:', authData);

  return (
    <div>
      <h1>Authentication Debug</h1>
      <pre>{JSON.stringify(authData, null, 2)}</pre>
    </div>
  );
}
```

## Implementation Checklist

### Setup Phase
- [ ] Create Clerk project and get keys
- [ ] Add environment variables to `.env.local`
- [ ] Install `@clerk/nextjs` package
- [ ] Wrap app with `ClerkProvider`
- [ ] Add sign-in/up components to layout

### Authentication Integration
- [ ] Implement server component auth pattern
- [ ] Add protected route logic
- [ ] Create user data filtering in database queries
- [ ] Test authentication flow end-to-end

### Production Deployment
- [ ] Add production domain to Clerk dashboard
- [ ] Update environment variables for production
- [ ] Configure HTTPS for production
- [ ] Test authentication in production environment

### Security Review
- [ ] Verify all database queries filter by userId
- [ ] Confirm no client-side data fetching
- [ ] Test unauthenticated route protection
- [ ] Validate session management works correctly

## Best Practices

### 1. Performance
- Use server components for authentication checks
- Minimize client-side authentication state
- Leverage Clerk's built-in caching

### 2. User Experience
- Provide clear sign-in/up flows
- Handle loading states gracefully
- Implement proper error messages

### 3. Security
- Always validate userId on server side
- Never trust client-side authentication state
- Implement proper session timeouts

### 4. Maintenance
- Keep Clerk SDK updated
- Monitor authentication metrics
- Regular security audits

## Conclusion

This authentication system ensures:
- **Security**: Proper user isolation and data protection
- **Performance**: Server-side authentication with Next.js optimizations
- **User Experience**: Seamless sign-in/up flows
- **Scalability**: Clerk handles user management at scale
- **Maintainability**: Clear patterns and consistent implementation

**These authentication patterns are mandatory and must be followed throughout the Workout Diary application.**