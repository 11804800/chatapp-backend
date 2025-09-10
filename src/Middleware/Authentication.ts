import User from "../Model/User";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import jwt, { JwtPayload } from "jsonwebtoken";

export const local = passport.use(new LocalStrategy(User.authenticate()));

const SecretKey: string | undefined = process.env.SECRET_KEY;

if (!SecretKey) {
    throw new Error('SECRET_KEY environment variable is not set');
}

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


export const getToken = ((user: object): string => {
    return jwt.sign(user, SecretKey, { expiresIn: "3600" })
});

let opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SecretKey
};

interface MyJwtPayload extends JwtPayload {
    _id: string;
}

passport.use(new JwtStrategy(opts, (jwtPayload: MyJwtPayload, done) => {
    User.findOne({ _id: jwtPayload._id }, (err: any, user: any) => {
        if (err) {
            return done(err, false);
        }
        else if (user) {
            return done(null, user)
        }
        else {
            return done(false, null)
        }
    })
}));

export const verifyUser=passport.authenticate('local',{session:false});