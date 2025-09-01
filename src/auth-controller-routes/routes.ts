import type {Request ,Response } from "express";
import bcryptjs from  "bcryptjs";
import  {User,Content} from  "../database/db.js"

import jwt from "jsonwebtoken";

const salt= await bcryptjs.genSalt(10);
export const Signup=async(req:Request,res:Response)=>{
  const {username,email ,pasword}=req.body;
  try{
    // first chehck
    if(!email  || !username ||!pasword){
       res.status(400).json({
        status:false,
        message:"Usernam and email  are required"
       })
    }
    // chheck is user present already or not in db
    const isExisting=await User.find({email})
    if(isExisting){
        return res.status(411).json({
            status:false,
            message:"User allready Logged In !!"
        })
    }
    // hasing password
    const hashpassword= await bcryptjs.hashSync(pasword ,salt)
    // creating user account
    await User.create({
      username:username,
      password:hashpassword,
      email:email
    })
    return res.status(201).json({
      status:true,
      message:"Account created successfully"
    })
  }catch(error){
    console.log("At the signup route",error)
    res.status(500).json({
    status:false,
    error:"Internal Server problem !!"
    })
  }
}

// login user account
export const Login=async(req:Request,res:Response)=>{
  const {email,password}=req.body;
  // Ispresnt on db
  try{
    const user=await User.findOne({email:email});
    if(!user){
      res.status(400).json({
        status:false,
        error:"Account does't exist !"
      })
    }
    //  check is paswword matach
    const  IsmatchPasswords=await bcryptjs.compare(password,user!.password);
    if(!IsmatchPasswords){
      return res.status(400).json({
        status:false,
        error:"Invalid credentials"
      })
    }
    // Send the  JWT token to user
  const token=jwt.sign({id:user?._id},"secondbarian" ,{expiresIn:"7d"})
    return res.status(200).json({
      status:true,
      message:"Login sucessfull",
      token:token
    })  
}catch(error){

    console.error("At the login route", error);
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!"
    });
  }
}
// --> Add content
export const ContentAdd=async(req:Request,res:Response)=>{

  const {title,link,tags}=req.body;
  if(!title){
    return res.status(404).json({
      status:false,
      error:"Title is requried !"
    })
  }
  try{
    await Content.create({
      title:title,
      link:link,
      tags:tags
    })
  return res.status(201).json({
    status:true,
    message:"Content add successfully "
  })
  }catch(error){
  console.error("At the add content route", error);
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!"
    });
  }

}
// --> get content
export const GetContent=async(req:Request,res:Response)=>{
try{
  const content=await Content.find({userId:req.userId});
  return res.status(200).json({
    statu:true,
    data:content,
  })
}catch(error){
  console.error("At the Get content", error);
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!"
    });
  }
}
// --> delete content
export const ContentDelete=async(req:Request,res:Response)=>{
  const {id}=req.params;
  console.log("From the Delete Route",id)
  try{
    const contentId=await Content.findOne({_id:id ,userId:req.userId}) 
    if(!contentId){
      return res.status(404).json({
        status:false,
        errorr:"Did't Finf Content"
      })
    }
    await Content.findByIdAndDelete({id})
    return res.status(200).json({
      status:true,
      message:" Content delete Succefully "
    })
}catch(error){
  console.error("At the delete route", error);
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!"
    });
  }

}