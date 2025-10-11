import { Request, Response } from "express";
import Status from "../Model/Status";


export const GetStatus = async (req: Request, res: Response) => {
    try {
        const data = await Status.find({});
        res.status(200).json({ data: data });
    }
    catch (err) {
        res.status(500).json({ err: err })
    }
}

export const PostStatus = async (req: Request, res: Response) => {
    try {
        const data = await Status.create({
            mediaType: req.body.mediaType,
            text: req.body.text,
            file: req.file?.filename,
            link: req.body.link,
            user: req.body?.user
        })
        res.status(200).json({ data: data });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export const DeleteStatus = async (req: Request, res: Response) => {
    try {
        const data = await Status.findByIdAndDelete({ _id: req.params.id })
        res.status(201).json({ data: data });
    }
    catch (err) {
        res.status(500).json({ err: err })
    }
}