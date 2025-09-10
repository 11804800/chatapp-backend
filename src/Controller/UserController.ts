import { NextFunction, Request, Response } from "express";
import passport from "passport";
import User from "../Model/User";
import { getToken } from "../Middleware/Authentication";

export const RegisterUserController = ((req: Request, res: Response) => {
    const { firstname, lastname, username, password } = req.body;
    User.register(new User({
        username: username,
        firstname: firstname,
        lastname: lastname
    }), password, (err: any, user: any) => {
        if (err) {
            res.status(400).json({ success: false, message: err });
        }
        else {
            user.save().then((user: any) => {
                passport.authenticate("local")(req, res, () => {
                    let token: string = getToken({ _id: user._id });
                    res.status(200).json({
                        sucess: true,
                        message: "User Registration Successfull",
                        token: token
                    })
                })
            }).catch((err: any) => {
                res.status(500).json({ success: false, message: err })
            })
        }
    })
});

export const LoginUserController = ((req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) {
            res.status(400).json({ info: err })
        }
        else if (!user) {
            res.status(401).json({ success: false, err: info.name, message: info.name })
        }
        else {
            req.login(user, (error) => {
                if (error) {
                    return res.status(500).json({ success: false, err: error.message });
                }
                let token = getToken({ _id: user._id });
                res.status(201).json({ succes: true, token: token })
            })
        }
    })(req, res, next);
});

export const UserInfoController = ((req: Request, res: Response) => {
    res.json("helo")
});

export const ResetPasswordController = (async (req: Request, res: Response) => {

    try {
        const { username, password } = req.body;
        const user = await User.findByUsername(username, false);
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        user.setPassword(password, async (err: any, user: any) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Password failed to change" });
            }
            await user.save();
            return res.status(200).json({ success: true, message: "Password changed" });
        })
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});

export const ChangePasswordController = (async (req: Request, res: Response) => {
    try {
        const { username, oldpassword,newpassword } = req.body;
        const user = await User.findByUsername(req.body.username, false);
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        user.changePassword(oldpassword,newpassword, (err: any, user: any) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Password failed to change" });
            }
            return res.status(200).json({ success: true, message: "Password changed" });
        })
    }
    catch (err:any) {
        res.status(500).json({ error: err.message });
    }
});

export const DeleteAccountController = ((req: Request, res: Response) => {
    res.json("helo")
});

