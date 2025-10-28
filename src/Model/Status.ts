import mongoose, { model, Schema } from "mongoose";

interface Status {
    text: string,
    file: string,
    link: string,
    mediaType: string,
    user: string,
    seen: any[],
    expires: object
}

const StatusSchema = new Schema<Status>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        type: String
    },
    file: {
        type: String
    },
    mediaType: {
        type: String
    },
    link: {
        type: String
    },
    expires: { type: Date, expires: '2m' },
    seen: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]
}, {
    timestamps: true
});

export default model('Status', StatusSchema);