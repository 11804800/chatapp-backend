import express from "express";
import bodyParser from "body-parser";
import { DeleteMessage, GetMessage, UpdateMessage } from "../Controller/MessageController";
import { verifyUser } from "../Middleware/Authentication";
const MessageRouter = express.Router();
MessageRouter.use(bodyParser.json());

MessageRouter.get("/", verifyUser, GetMessage);
MessageRouter.put("/:id", verifyUser, UpdateMessage);
MessageRouter.delete("/:id", verifyUser, DeleteMessage);

export default MessageRouter;