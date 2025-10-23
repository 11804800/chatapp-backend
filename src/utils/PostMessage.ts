import Messages from "../Model/Messages";
export const PostMessage = async (body: any) => {
    try {
        const data = await Messages.create({
            message: body?.message,
            media: body?.media,
            mediaType: body?.mediaType,
            consumer: body?.consumer,
            publisher: body.publisher,
            sent: true,
            sentTime: new Date(),
            reply: body?.reply,
            forward: body?.forward,
            mediaDuration: body?.mediaDuration
        });
        return data;
    }
    catch (err: any) {
        return err;
    }
}