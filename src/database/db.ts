
import mongoose from "mongoose";
const {Schema} =mongoose;
const userScheam=new Schema({
    username:{type:String ,required:true},
    email:{type:String ,required:true,unique:true},
    password:{type:String,required:true}
})


const ContentScheam=new Schema({
    title:String,
    link:String,
    icons:{
        type:String,
        enum:["youtube" , "twitter" ,"spotify"],
    },
    brain:{
        type:String,
          enum:["youtube" , "twitter" ,"spotify"],

    },
    tags:[String],
    userId:{type:mongoose.Types.ObjectId,ref:"user",required:true}
},{timestamps:true})
 
const LinkSchema =new Schema({
     hash:String,
     userId:{type:mongoose.Types.ObjectId,ref:'user',required:true}
})

export const Link=mongoose.model('link',LinkSchema)
export const User=mongoose.model('user',userScheam);
export const Content=mongoose.model('content',ContentScheam);


