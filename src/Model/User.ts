import mongoose, { Schema, model } from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose'


const ContactSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    lastMessage: {
        type: String
    },
    unseenmessagecount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const UserShema = new Schema({
    image: {
        type: String
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String
    },
    socket_id: {
        type: String
    },
    contact: [ContactSchema],
    online: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    },
    status: [{ type: mongoose.Schema.Types.ObjectId, ref: "Status" }]
}, {
    timestamps: true
});

UserShema.plugin(passportLocalMongoose);
const User = model<any>("user", UserShema);
export default User;