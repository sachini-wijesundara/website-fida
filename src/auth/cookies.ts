export const COOKIE_NAME = "auth_session";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" && process.env.USE_SECURE_COOKIES === "true",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24, // 1 day
  path: "/",
};

export function setSessionCookie(cookies: any) {
  cookies.set(COOKIE_NAME, "true", COOKIE_OPTIONS);
}

export function clearSessionCookie(cookies: any) {
  cookies.set(COOKIE_NAME, "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
  });
}
