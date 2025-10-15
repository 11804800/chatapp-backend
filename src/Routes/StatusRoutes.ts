import express from 'express';
import bodyParser from 'body-parser';
import { DeleteStatus, GetStatus, PostStatus, UpdateStatus } from '../Controller/StatusController';
import multer, { StorageEngine } from 'multer';
import path from 'path';
import { verifyUser } from '../Middleware/Authentication';


const storage: StorageEngine = multer.diskStorage({
    destination: (req: any, file: Express.Multer.File, cb: any) => {
        cb(null, "public/status/");
    },
    filename: (req: any, file: Express.Multer.File, cb: any) => {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const StatusRouter = express.Router();
StatusRouter.use(bodyParser.json());

StatusRouter.get("/", verifyUser, GetStatus);

StatusRouter.post("/", verifyUser, upload.single("media"), PostStatus);

StatusRouter.delete("/:id", verifyUser, DeleteStatus);
StatusRouter.put("/:id", verifyUser, UpdateStatus);

export default StatusRouter;