import type { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { User, Content, Link } from "../database/db.js";

import jwt from "jsonwebtoken";
import { random } from "../hash.js";
const JWT = process.env.JWT;
const salt = await bcryptjs.genSalt(10);

export const Signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    // first chehck
    if (!email || !username || !password) {
      res.status(400).json({
        status: false,
        message: "Username and email  are required",
      });
    }
    // check is user present already or not in db
    const isExisting = await User.findOne({ email });
    if (isExisting) {
      return res.status(411).json({
        status: false,
        message: "User already Logged In !!",
      });
    }
    // hasing password
    const hashpassword = await bcryptjs.hashSync(password, salt);
    // creating user account
    await User.create({
      username: username,
      password: hashpassword,
      email: email,
    });
    return res.status(201).json({
      status: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log("At the signup route", error);
    res.status(500).json({
      status: false,
      error: "Internal Server problem !!",
    });
  }
};

// login user account
export const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Ispresnt on db
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({
        status: false,
        error: "Account does't exist !",
      });
    }
    //  check is paswword matach
    const IsmatchPasswords = await bcryptjs.compare(password, user!.password);
    if (!IsmatchPasswords) {
      return res.status(400).json({
        status: false,
        error: "Invalid credentials",
      });
    }
    // Send the  JWT token to user
    if (!JWT) {
      throw new Error("Not JWT token ");
    }
    const token = jwt.sign({ id: user?._id }, JWT, { expiresIn: "7d" });
    return res.status(200).json({
      status: true,
      message: "Login sucessfull",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};
// --> Add content
export const ContentAdd = async (req: Request, res: Response) => {
  const { title, link, tags, icons, brain } = req.body;
  if (!title) {
    return res.status(404).json({
      status: false,
      error: "Title is requried !",
    });
  }
  try {
    await Content.create({
      title: title,
      link: link,
      userId: req.userId,
      // array of the tags
      tags:
        typeof tags === "string"
          ? tags.split(",").map((t) => t.trim()) // "youtube,vibe" → ["youtube","vibe"]
          : tags,
      brain: brain,
      type: icons,
    });
    return res.status(201).json({
      status: true,
      message: "Content add successfully ",
    });
  } catch (error) {
    console.error("At the add content route", error);
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};
// get user Info
export const Getuser = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user = await User.findById({ _id: userId }).select("-password");
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Can't find user account !",
      });
    }

    return res.status(200).json({
      status: true,
      data: user,
      message: "user infromation  !",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went Wrong !",
    });
  }
};
// --> get content
export const GetContent = async (req: Request, res: Response) => {
  try {
    const content = await Content.find({ userId: req.userId }).populate("userId", "username");
    return res.status(200).json({
      statu: true,
      data: content,
    });
  } catch (error) {
    console.error("At the Get content", error);
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};
// --> delete content
export const ContentDelete = async (req: Request, res: Response) => {
  const { contentId } = req.body;
 
  try {
    const content = await Content.findOne({ _id: contentId });
    if (!content) {
      return res.status(404).json({
        status: false,
        errorr: "Did't Finf Content",
      });
    }
    await Content.findByIdAndDelete({ contentId, userId: req.userId });
    return res.status(200).json({
      status: true,
      message: " Content delete Succefully ",
    });
  } catch (error) {
    console.error("At the delete route", error);
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};
// share able link
export const ShareLink = async (req: Request, res: Response) => {
  const share = req.body.share;
  console.log("True or false ", share);
  try {
    if (share) {
      const existingLink = await Link.findOne({
        userId: req.userId,
      });
      if (existingLink) {
        return res.status(200).json({
          status: true,
          hash: existingLink.hash,
        });
      }
      const hash = random(10);
      await Link.create({
        userId: req.userId,
        hash: hash,
      });
      return res.status(200).json({
        status: true,
        hash,
        message: "Share able Link !",
      });
    } else {
      await Link.deleteOne({
        userId: req.userId,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Remove sharable Link",
    });
  } catch (error) {
    console.error("At the delete route", error);
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};
// after the share link
export const GetSharelinkcontent = async (req: Request, res: Response) => {
  const hash = req.params.shareLink;
  try {
    const link = await Link.findOne({
      hash: hash,
    });
    if (!link) {
      return res.status(400).json({
        status: false,
        error: "Can't get ShareLink Dcoument !",
      });
    }
    // find the content
    const content = await Content.findOne({
      userId: link?.userId,
    }).populate("userId","username");
    // find the userdata
    const user = await User.findOne({
      _id: link?.userId,
    })
    if (!user) {
      return res.status(411).json({
        status: false,
        error: "User may not exist !!",
      });
    }
    res.status(200).json({
      username: user.username,
      content: content,
    });
  } catch (error) {
    console.error("At the delete route", error);
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};


export const GetBrainContent = async (req: Request, res: Response) => {
  const {brain} = req.params; 
  const user_id=req.userId;
  console.log("Testing id",user_id)
  try {
    if (!brain || !user_id) {
      return res.status(400).json({
        status: false,
        message: "Account not Login !",
      });
    }
    // db check
    const data = await Content.find(
      { brain: brain,userId:user_id }
    ).populate("userId", "username");
    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Content not found !",
      });
    }
    console.log(data)
    return res.status(200).json({
      status: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};
