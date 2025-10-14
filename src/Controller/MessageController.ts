import { Request, Response } from "express";
import Messages from "../Model/Messages";

export const GetMessage = async (req: any, res: Response) => {
    try {
        const data = await Messages.find({ $or: [{ publisher: req.user?._id }, { consumer: req.user?._id }] })
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