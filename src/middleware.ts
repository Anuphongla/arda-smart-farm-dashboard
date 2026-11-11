import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    "cloudpulse_super_secret_session_token_key_32chars!",
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
