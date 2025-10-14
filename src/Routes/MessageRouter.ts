import express from "express";
import bodyParser from "body-parser";
import { DeleteMessage, GetMessage, UpdateMessage, UpdateMessages, UpdateMessageSeen } from "../Controller/MessageController";
import { verifyUser } from "../Middleware/Authentication";
const MessageRouter = express.Router();
MessageRouter.use(bodyParser.json());

MessageRouter.get("/", verifyUser, GetMessage);
MessageRouter.put("/:id", verifyUser, UpdateMessage);
MessageRouter.delete("/:id", verifyUser, DeleteMessage);
MessageRouter.put("/", verifyUser, UpdateMessages);
MessageRouter.put("/publisher/seen", verifyUser, UpdateMessageSeen);

export default MessageRouter;