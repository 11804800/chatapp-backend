import express from "express";
import bodyParser from "body-parser";
import {
    ClearChat,
    DeleteMessage,
    GetMessage,
    HideMessage,
    PostAudio,
    UpdateMessage,
    UpdateMessages,
    UpdateMessageSeen
} from "../Controller/MessageController";
import { verifyUser } from "../Middleware/Authentication";
import multer, { StorageEngine } from "multer";
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

const uploadMedia: any = multer({ storage: Storage });

MessageRouter.get("/", verifyUser, GetMessage);
MessageRouter.put("/hide", verifyUser, HideMessage);
MessageRouter.put("/clear-chat", verifyUser, ClearChat);
MessageRouter.put("/", verifyUser, UpdateMessages);
MessageRouter.put("/:id", verifyUser, UpdateMessage);
MessageRouter.delete("/:id", verifyUser, DeleteMessage);
MessageRouter.put("/publisher/seen", verifyUser, UpdateMessageSeen);
MessageRouter.post("/media", verifyUser, uploadMedia.single("audio"), PostAudio);


export default MessageRouter;