import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../lib/prisma";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },

    async (_, __, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email found"));
        }

        let user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email,
              avatar: profile.photos?.[0]?.value,
              provider: "GOOGLE",
            },
          });
        }

        //Return only the data your app needs
        return done(null, {
          userId: user.id,
          role: user.role,
        });

      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

export default passport;