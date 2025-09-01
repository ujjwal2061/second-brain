import { Router } from "express";
import {Login,Signup} from "../auth-controller-routes/routes.js"

const router=Router();
router.post("/signup",Signup)
router.post("/login",Login)

export default router;