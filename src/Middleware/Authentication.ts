import passport from "passport";
import User from "../Model/User";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt, { JwtPayload } from 'jsonwebtoken';

const secretKey: string | undefined = process.env.SECRET_KEY;
if (!secretKey) {
    throw new Error('SECRET_KEY environment variable is not set');
}

export const local = passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export const getToken = (user: object): string => {
    return jwt.sign(user, secretKey, { expiresIn: '1d' });
};

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey,
};

interface MyJwtPayload extends JwtPayload {
    _id: string;
}

passport.use(
    new JwtStrategy(opts, async (jwt_payload: MyJwtPayload, done) => {
        try {
            const user = await User.findOne({ _id: jwt_payload._id });
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    })
);

export const verifyUser = passport.authenticate('jwt', { session: false });