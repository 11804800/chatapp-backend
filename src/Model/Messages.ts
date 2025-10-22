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
    hiddenId: []
}

const Message = new Schema<MessageInterface>({
    message: {
        type: String
    },
    media: {
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
    hiddenId: []
}, {
    timestamps: true
});

export default model("messages", Message);