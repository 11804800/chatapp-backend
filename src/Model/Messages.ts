import mongoose, { model, Schema } from "mongoose";

interface MessageInterface {
    message: string,
    media: string,
    mediaType: String,
    publisher: string,
    consumer: string
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
    }
}, {
    timestamps: true
});

export default model("messages", Message);