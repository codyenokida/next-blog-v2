import type { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const options: NextAuthOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username: ",
          type: "text",
          placeholder: "coool username",
        },
        password: {
          label: "Password: ",
          type: "password",
          placeholder: "**********",
        },
      },
      async authorize(credentials) {
        /**
         * This is where you need to retrieve user data
         * to verify credentials (https://next-auth.js.org/configuration/providers/credentials)
         * We won't do this though, and we'll just add a
         * hard-coded password since it's only me using this
         */
        const user = {
          id: process.env.ADMIN_ID as string,
          name: process.env.ADMIN_NAME as string,
          password: process.env.ADMIN_PASSWORD as string,
        };
        if (
          credentials?.username === user.name &&
          credentials?.password === user.password
        ) {
          return user;
        }
        return null;
      },
    }),
  ],
};
