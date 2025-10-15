import { Request, Response } from "express";
import Status from "../Model/Status";
import User from "../Model/User";


export const GetStatus = async (req: any, res: Response) => {
    try {
        const data = await User.findById(req.user?._id).populate({
            path: "contact.userId",
            select: "firstname lastname image status",
            populate: {
                path: "status",
                model: "Status"
            }
        }).populate({
            path: "status",
            populate: {
                path: "seen",
                model: "user"
            }
        });

        res.status(200).json({ data: data });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export const PostStatus = async (req: any, res: Response) => {
    try {
        const data = await Status.create({
            mediaType: req.body.mediaType,
            text: req.body.text,
            file: `status/${req.file?.filename}`,
            link: req.body.link,
            user: req.user?._id
        });
        await User.findByIdAndUpdate(req.user?._id, { $push: { status: data._id } });
        res.status(200).json({ data: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
export const DeleteStatus = async (req: Request, res: Response) => {
    try {
        const data = await Status.findByIdAndDelete({ _id: req.params.id })
        res.status(201).json({ data: data });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export const UpdateStatus = async (req: any, res: Response) => {
    try {
        const data = await Status.findByIdAndUpdate(req.params.id, { $push: { seen: req.user?._id } });
        res.status(200).json({ data: data });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}