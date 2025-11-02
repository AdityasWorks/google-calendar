import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin",
    },
    callbacks: {
        async jwt({ token, account, profile }) {
            // On sign in, add user info to token
            if (account && profile) {
                token.email = profile.email;
                token.name = profile.name;
                token.picture = profile.picture;
                if (profile.sub) {
                    token.sub = profile.sub; // Google user ID
                }
            }
            return token;
        },
        async session({ session, token }) {
            // Add token data to session
            if (session.user) {
                session.user.id = token.sub as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.image = token.picture as string;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    trustHost: true,
});
