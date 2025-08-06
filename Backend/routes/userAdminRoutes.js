import express from "express";
import { getUsers, updateUserSuspension } from "../controllers/userAdminController.js";

const router = express.Router();

router.put("/user/suspend", updateUserSuspension); // PUT /api/admin/user/suspend
router.get("/users", getUsers);

export default router;
