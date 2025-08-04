/**
 * Get the correct base URL for the current environment
 * This ensures redirects work properly in both development and production
 */
export function getBaseUrl(): string {
  // Browser environment
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Server environment
  // Check for Vercel deployment
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // Check for custom site URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Fallback to localhost for development
  return "http://localhost:3000";
}

/**
 * Get the authentication callback URL
 */
export function getAuthCallbackUrl(): string {
  return `${getBaseUrl()}/auth/callback`;
}

/**
 * Get the site URL for Supabase configuration
 */
export function getSiteUrl(): string {
  return getBaseUrl();
}
