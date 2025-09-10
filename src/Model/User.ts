import { Schema,model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"


const User=new Schema({
    firstname:{
        type:String,
    },
    lastname:{
        type:String
    }
},{
    timestamps:true
});

User.plugin(passportLocalMongoose);
export default model<any>("user",User);