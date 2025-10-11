import express from 'express';
import { ChangePasswordController, DeleteAccountController, LoginUserController, RegisterUserController, ResetPasswordController, UserInfoController } from '../Controller/UserController';
import { verifyUser } from '../Middleware/Authentication';

const UserRouter = express.Router();

UserRouter.get('/', verifyUser, UserInfoController);
UserRouter.delete("/", DeleteAccountController);
UserRouter.post('/register', RegisterUserController);
UserRouter.post("/login", LoginUserController);
UserRouter.post("/reset-password", ResetPasswordController);
UserRouter.post("/change-password", ChangePasswordController);


export default UserRouter;