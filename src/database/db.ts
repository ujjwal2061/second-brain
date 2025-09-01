import { hash } from "bcryptjs";
import mongoose, { Mongoose } from "mongoose";
const {Schema} =mongoose;
const userScheam=new Schema({
    username:{type:String ,required:true},
    email:{type:String ,required:true,unique:true},
    password:{type:String,required:true}
})

const ContentScheam=new Schema({
    title:String,
    link:String,
    tags:[{type:mongoose.Types.ObjectId, ref:"Tag"}],
    userId:{type:mongoose.Types.ObjectId,ref:"User",required:true}
})
 
const LinkSchema =new Schema({
     hash:String,
     userId:{type:mongoose.Types.ObjectId,ref:'User',required:true}
})
export const Link=mongoose.model('link',LinkSchema)
export const User=mongoose.model('user',userScheam);
export const Content=mongoose.model('content',ContentScheam);

