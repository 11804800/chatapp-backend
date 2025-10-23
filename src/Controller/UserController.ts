import { NextFunction, Request, Response } from "express";
import passport from "passport";
import User from "../Model/User";
import { getToken } from "../Middleware/Authentication";
import Messages from "../Model/Messages";

export const RegisterUserController = ((req: Request, res: Response) => {
    User.register(new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }), req.body.password, (err: any, user: any) => {
        if (err) {
            res.status(500).json({ success: false, message: err })
        }
        else {
            user.save()
                .then((user: any) => {
                    passport.authenticate('local')(req, res, () => {
                        let token: string = getToken({ _id: user._id });
                        res.status(200).json({ success: true, token: token })
                    })
                })
                .catch((err: any) => {
                    res.status(500).json({ success: false, message: err })
                })
        }
    })
});

export const GetAllUser = async (req: Request, res: Response) => {
    try {
        const data: any = await User.find({});
        res.status(200).json({ data: data });
    }
    catch (error: any) {
        res.status(500).json({ error: error });
    }
}

export const LoginUserController = ((req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) {
            res.status(500).json({ success: false, err: err })
        }
        else if (!user) {
            res.status(401).json({ success: false, err: info.name, message: info.name })
        }
        else {

            req.logIn(user, (error) => {
                if (error) {
                    return res.status(500).json({ success: false, err: error.message });
                }
                let token: string = getToken({ _id: user._id });
                res.status(200).json({ success: true, token: token })
            })
        }
    })(req, res, next);
});

export const UserInfoController = async (req: any, res: Response) => {
    try {
        const data: any = await User.findById(req.user?._id).populate({
            path: "contact.userId",
            select: "firstname lastname image socket_id description online"
        });
        res.status(200).json({ data: data })
    }
    catch (error: any) {
        res.status(500).json({ error: error.message })
    }
};

export const GetUserInfo = async (req: Request, res: Response) => {
    try {
        const data: any = await User.findById(req.params.id);
        res.status(200).json({ firstname: data.firstname, lastname: data.lastname, socket_id: data?.socket_id, image: data?.image, _id: data._id });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message })
    }
};

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
        const { username, oldpassword, newpassword } = req.body;
        const user = await User.findByUsername(req.body.username, false);
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        user.changePassword(oldpassword, newpassword, (err: any, user: any) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Password failed to change" });
            }
            return res.status(200).json({ success: true, message: "Password changed" });
        })
    }
    catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export const DeleteAccountController = ((req: Request, res: Response) => {
    res.json("helo")
});



export const AddContact = async (req: any, res: Response) => {
    try {
        const { contact } = req.body;
        const data: any = await User.findById(req.user?._id);
        const isAlreadyPresent = data.contact.some((item: any) => item.userId == contact);
        if (!isAlreadyPresent) {
            data.contact.push({ userId: contact });
            await data.save();
        }
        res.status(201).json({ data: data })
    }
    catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteContact = async (req: any, res: Response) => {
    try {

        const { contact } = req.params;
        const data: any = await User.findByIdAndUpdate(req.user?._id);
        data.contact = data.contact.filter((item: any) => item.userId != contact);
        await data.save();

        await Messages.updateMany(
            {
                $or: [
                    { publisher: req.user?._id, consumer: contact },
                    { publisher: contact, consumer: req.user?._id }
                ]
            }, {
            $push: { hiddenId: req.user?._id }
        });

        res.status(201).json({ data: data })
    }
    catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteContacts = async (req: any, res: Response) => {
    try {

        const { contacts } = req.body;
        const data: any = await User.findById(req.user?._id);
        const filteredData = data.contact.filter((item: any) => !contacts.includes(item.userId.toString()));
        data.contact = filteredData;
        await data.save();

        contacts.map(async (item: any) => {
            await Messages.updateMany(
                {
                    $or: [
                        { publisher: req.user?._id, consumer: item },
                        { publisher: item, consumer: req.user?._id }
                    ]
                }, {
                $push: { hiddenId: req.user?._id }
            });
        })

        res.status(201).json({ data: data.contact, contacts: filteredData })
    }
    catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}



export const UpdateUserInfo = async (req: any, res: Response) => {
    try {
        if (req.file) {
            const data: any = await User.findByIdAndUpdate(req.user?._id, {
                $set: {
                    image: `/images/${req.file.filename}`,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    description: req.body?.description
                }
            }, { new: true });
            res.status(201).json({ data: data })
        }
        else {
            const data: any = await User.findByIdAndUpdate(req.user?._id, { $set: req.body }, { new: true });
            res.status(201).json({ data: data })
        }
    }
    catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}