import { Router } from "express";
import {
  Login,
  Signup,
  ContentAdd,
  ContentDelete,
  GetContent,
  Getuser,
  ShareLink,
  GetSharelinkcontent,
  GetBrainContent,
} from "../auth-controller-routes/routes.js";
import Usermiddlware from "../middlware/middlware.js";

const router = Router();
router.post("/signup", Signup);
router.post("/login", Login);
router.get("/my-detalis", Usermiddlware, Getuser);
router.get("/content", Usermiddlware, GetContent);
router.post("/add-content", Usermiddlware, ContentAdd);
router.post("/share", Usermiddlware, ShareLink);
router.get("/share-content/:shareLink", GetSharelinkcontent);
router.get("/brain/:brain",Usermiddlware,GetBrainContent)
router.delete("/delete-content", Usermiddlware, ContentDelete);
export default router;
