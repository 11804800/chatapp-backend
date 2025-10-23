import { Request, Response } from "express";
import Messages from "../Model/Messages";

export const GetMessage = async (req: any, res: Response) => {
    try {
        const data = await Messages.find({
            $or: [
                { publisher: req.user?._id },
                { consumer: req.user?._id }
            ],
            hiddenId: { $nin: [req.user?._id] }
        }).populate({
            path: "reply",
            select: "message media mediaType mediaDuration"
        });
        res.status(200).json({ data: data, user: req.user });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const UpdateMessage = async (req: Request, res: Response) => {
    try {
        const data = await Messages.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true
        });
        res.status(200).json({ data: data });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const DeleteMessage = async (req: Request, res: Response) => {
    try {
        const data = await Messages.findByIdAndDelete(req.params.id)
        res.status(200).json({ data: data });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}


export const UpdateMessages = async (req: any, res: Response) => {
    try {
        await Messages.updateMany({
            _id: { $in: req.body.idArray }
        }, {
            $set: { recived: true, recivedTime: new Date() }
        })
        res.status(200).json({ reciever: req.user?._id });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const UpdateMessageSeen = async (req: any, res: Response) => {
    try {
        await Messages.updateMany({
            _id: { $in: req.body.idArray }
        }, {
            $set: { seen: true }
        })
        res.status(200).json({ reciever: req.user?._id });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const PostAudio = async (req: any, res: Response) => {
    try {
        const data: any = await Messages.create({
            media: `/audio/${req.file.filename}`,
            mediaType: "audio",
            consumer: req.body.consumer,
            publisher: req.user?._id,
            sentTime: new Date(),
            sent: true,
            mediaDuration: req.body.mediaDuration
        });
        res.status(200).json({ data: data });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const HideMessage = async (req: any, res: Response) => {
    try {
        await Messages.updateMany({
            _id: { $in: req.body.idArray }
        }, {
            $push: { hiddenId: req.user?._id }
        })
        res.status(200).json({ reciever: req.user?._id });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const ClearChat = async (req: any, res: Response) => {
    try {
        const { contact } = req.body;
        await Messages.updateMany(
            {
                $or: [
                    { publisher: req.user?._id, consumer: contact },
                    { publisher: contact, consumer: req.user?._id }
                ]
            }, {
            $push: { hiddenId: req.user?._id }
        });
        res.status(200).json({ reciever: req.user?._id });
    }
    catch (err: any) {
        res.status(500).json({ err: err.message });
    }
}


export const PostMediaMessage = async (req: any, res: Response) => {
    try {
        const data: any = await Messages.create({
            media: `${req.file.filename}`,
            mediaType: req.body.mediaType,
            consumer: req.body.consumer,
            publisher: req.user?._id,
            message: req.body.message,
            sentTime: new Date(),
            sent: true,
            mediaDuration: req.body.mediaDuration
        });
        res.status(200).json({ data: data });
    }
    catch (err: any) {
        res.status(500).json({ err: err.message });
    }
}