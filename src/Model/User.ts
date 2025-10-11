import { Schema, model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"


const User = new Schema({
    image: {
        type: String
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String
    },
    contact: [

    ]
}, {
    timestamps: true
});

User.plugin(passportLocalMongoose);
export default model<any>("user", User);