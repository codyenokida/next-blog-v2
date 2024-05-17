export { default } from "next-auth/middleware";

/**
 * https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
export const config = {
  matcher: ["/dashboard", "/post/[id]/edit", "/post/upload"],
};
