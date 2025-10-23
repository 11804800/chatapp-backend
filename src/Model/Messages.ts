import mongoose, { model, Schema } from "mongoose";

interface MessageInterface {
    message: string,
    media: string,
    mediaType: String,
    publisher: string,
    consumer: string,
    seen: boolean,
    recived: boolean,
    recivedTime: string,
    sent: Boolean,
    sentTime: string,
    hiddenId: [],
    forward: boolean,
    reply: string,
    reaction: string,
    mediaDuration: string
}

const Message = new Schema<MessageInterface>({
    message: {
        type: String
    },
    media: {
        type: String
    },
    mediaDuration: {
        type: String
    },
    mediaType: {
        type: String
    },
    consumer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    seen: {
        type: Boolean,
        default: false
    },
    recived: {
        type: Boolean,
        default: false
    },
    recivedTime: {
        type: String
    },
    sent: {
        type: Boolean,
        default: false
    },
    sentTime: {
        type: String
    },
    hiddenId: [],
    forward: {
        type: Boolean,
        default: false
    },
    reply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "messages"
    },
    reaction: {
        type: String
    }
}, {
    timestamps: true
});

export default model("messages", Message);