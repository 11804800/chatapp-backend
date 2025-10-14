import express from 'express';
import { AddContact, ChangePasswordController, DeleteAccountController, deleteContact, GetAllUser, GetUserInfo, LoginUserController, RegisterUserController, ResetPasswordController, UpdateUserInfo, UserInfoController } from '../Controller/UserController';
import { verifyUser } from '../Middleware/Authentication';
import User from '../Model/User';

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
UserRouter.put("/", verifyUser, UpdateUserInfo);
UserRouter.get("/info/:id", verifyUser, GetUserInfo);


export default UserRouter;