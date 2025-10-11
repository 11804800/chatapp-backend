import express from 'express';
import bodyParser from 'body-parser';
import { DeleteStatus, GetStatus, PostStatus } from '../Controller/StatusController';
import multer, { StorageEngine } from 'multer';
import path from 'path';


const storage: StorageEngine = multer.diskStorage({
    destination: (req: any, file: Express.Multer.File, cb: any) => {
        cb(null, "public/Status/");
    },
    filename: (req: any, file: Express.Multer.File, cb: any) => {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const StatusRouter = express.Router();
StatusRouter.use(bodyParser.json());

StatusRouter.get("/", GetStatus);

StatusRouter.post("/", upload.single("media"), PostStatus);

StatusRouter.delete("/:id", DeleteStatus);

export default StatusRouter;