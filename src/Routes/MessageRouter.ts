import express from "express";
import bodyParser from "body-parser";
import {
    ClearChat,
    DeleteMessage,
    GetMessage,
    HideMessage,
    PostAudio,
    PostMediaMessage,
    UpdateMessage,
    UpdateMessages,
    UpdateMessageSeen
} from "../Controller/MessageController";
import { verifyUser } from "../Middleware/Authentication";
import multer, { StorageEngine } from "multer";
import path from "path";
const MessageRouter = express.Router();
MessageRouter.use(bodyParser.json());



const Storage: StorageEngine = multer.diskStorage({
    destination: (req: any, file: Express.Multer.File, cb: any) => {
        cb(null, "public/audio");
    },
    filename: (req: any, file: Express.Multer.File, cb: any) => {
        cb(null, `${Date.now()}-${file.originalname}.mp3`)
    }
});

const Storage1: StorageEngine = multer.diskStorage({
    destination: (req: any, file: Express.Multer.File, cb: any) => {
        cb(null, "public");
    },
    filename: (req: any, file: Express.Multer.File, cb: any) => {
        cb(null, file.originalname + path.extname(file.originalname));
    },
});


const uploadMedia: any = multer({ storage: Storage });
const upload: any = multer({ storage: Storage1 });

MessageRouter.get("/", verifyUser, GetMessage);
MessageRouter.put("/hide", verifyUser, HideMessage);
MessageRouter.put("/clear-chat", verifyUser, ClearChat);
MessageRouter.put("/", verifyUser, UpdateMessages);
MessageRouter.put("/:id", verifyUser, UpdateMessage);
MessageRouter.delete("/:id", verifyUser, DeleteMessage);
MessageRouter.put("/publisher/seen", verifyUser, UpdateMessageSeen);
MessageRouter.post("/media", verifyUser, uploadMedia.single("audio"), PostAudio);
MessageRouter.post("/", verifyUser, upload.single("file"), PostMediaMessage);


export default MessageRouter;