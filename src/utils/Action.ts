import axios from "axios"
import { Request, Response } from "express"
import User from "../Model/User";

export const SetSocket = async (body: any) => {
    try {
        const { socket, id } = body;
        await User.findByIdAndUpdate(id, { $set: { socket_id: socket } }, { new: true });
    }
    catch (err: any) {
        console.log(err)
    }
}

export const GetUserSocketID = async (body: any) => {
    try {
        const data = await User.findById(body);
        return data;
    }
    catch (err) {
        return err;
    }
}


export const GetContact = async (body: any) => {
    try {
        const { consumer, publisher } = body;
        const data = await User.findById(consumer);
        const isPresent = data.contact.some((item: any) => item.userId == publisher);
        return isPresent;
    }
    catch (err) {
        return err;
    }
}

export const AddContact = async (body: any) => {
    try {
        const { consumer, publisher } = body;
        const data = await User.findByIdAndUpdate(consumer);
        const isAlreadyPresent = data.contact.some((item: any) => item.userId == publisher);
        if (!isAlreadyPresent) {
            data.contact.push({ userId: publisher });
            await data.save();
        }
    }
    catch (err) {
        return err;
    }
}

export const UpdatelastMessage = async (body: any) => {
    try {
        const data: any = await User.findById(body.publisher);
        const contact: any = data.contact.find((c: any) => c.userId.toString() === body.consumer);
        if (contact) {
            contact.lastMessage = body.message;
            contact.mediaType = body.mediaType;
            await data.save();
        }
    }
    catch (err: any) {
        return err;
    }
}
export const UpdatelastMessage2 = async (body: any) => {
    try {
        const data: any = await User.findById(body.consumer);
        const contact: any = data.contact.find((c: any) => c.userId.toString() === body.publisher);
        if (contact) {
            contact.lastMessage = body.message;
            contact.mediaType = body.mediaType;
            await data.save();
        }
    }
    catch (err: any) {
        return err;
    }
}


export const UpdateContact = async (body: any) => {
    try {
        const data: any = await User.findById(body.consumer);
        const contact: any = data.contact.find((c: any) => c.userId.toString() === body.publisher);
        if (contact) {
            contact.lastMessage = body.message;
            contact.unseenmessagecount = (contact.unseenmessagecount || 0) + 1;
            await data.save();
        }
    }
    catch (err: any) {
        return err;
    }
}

export const DeleteMessageCount = async (body: any) => {
    try {
        const data: any = await User.findById(body.consumer);
        const contact: any = data.contact.find((c: any) => c.userId.toString() === body.publisher);
        if (contact) {
            contact.unseenmessagecount = 0;
            await data.save();
        }
    }
    catch (err: any) {
        return err;
    }
}