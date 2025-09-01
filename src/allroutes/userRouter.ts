import { Router } from "express";
import {Login,Signup,ContentAdd,ContentDelete,GetContent} from "../auth-controller-routes/routes.js"
import Usermiddlware from "../middlware/middlware.js"

const router=Router();
router.post("/signup",Signup)
router.post("/login",Login)
router.get("/my-content",Usermiddlware,GetContent)
router.post("/content",Usermiddlware ,ContentAdd);
router.delete("/delete-content",Usermiddlware,ContentDelete)
export default router;