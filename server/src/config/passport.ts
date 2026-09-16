import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../lib/prisma";
import { lockEmail } from "../services/otp.service";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },

    async (_, __, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value.trim().toLowerCase();

        if (!email || profile._json.email_verified !== true) {
          return done(new Error("A verified Google email is required"));
        }

        const user = await prisma.$transaction(async tx => {
          await lockEmail(tx, email);
          const existing = await tx.user.findUnique({ where: { email } });
          if (existing) {
            // A pre-existing, unverified local password must not survive an
            // ownership claim through Google (account pre-hijacking protection).
            return tx.user.update({ where: { id: existing.id }, data: {
              emailVerifiedAt: existing.emailVerifiedAt ?? new Date(),
              ...(!existing.emailVerifiedAt ? {
                password: null, tokenVersion: { increment: 1 }, provider: "GOOGLE",
              } : {}),
            } });
          }
          return tx.user.create({ data: {
            name: profile.displayName, email, avatar: profile.photos?.[0]?.value,
            provider: "GOOGLE", emailVerifiedAt: new Date(),
          } });
        });

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