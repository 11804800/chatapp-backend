import express, { Request } from 'express';
import { AddContact, ChangePasswordController, DeleteAccountController, deleteContact, GetAllUser, GetUserInfo, LoginUserController, RegisterUserController, ResetPasswordController, UpdateUserInfo, UserInfoController } from '../Controller/UserController';
import { verifyUser } from '../Middleware/Authentication';
import multer from 'multer';
import path from 'path';

const storage: any = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: any) => {
        cb(null, "public/images/");
    },
    filename: (req: Request, file: Express.Multer.File, cb: any) => {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload: any = multer({ storage: storage });

const UserRouter = express.Router();

UserRouter.get('/', verifyUser, UserInfoController);
UserRouter.get("/all", GetAllUser);
UserRouter.delete("/", DeleteAccountController);
UserRouter.post('/register', RegisterUserController);
UserRouter.post("/login", LoginUserController);
UserRouter.post("/reset-password", ResetPasswordController);
UserRouter.post("/change-password", ChangePasswordController);

UserRouter.post("/contact", verifyUser, AddContact);
UserRouter.delete("/contact", verifyUser, deleteContact);
UserRouter.put("/", verifyUser, upload.single("profile-image"), UpdateUserInfo);
UserRouter.get("/info/:id", verifyUser, GetUserInfo);


export default UserRouter;