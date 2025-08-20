import express from "express";
import { getUsers, updateUserSuspension } from "../controllers/userAdminController.js";
import { inviteSubadmin, verifyInvite, registerSubadmin } from '../controllers/invite.js'; // Adjust path

const router = express.Router();

router.put("/user/suspend", updateUserSuspension); // PUT /api/admin/user/suspend
router.get("/users", getUsers);
router.post('/invite', inviteSubadmin);
router.post('/verify-invite', verifyInvite);
router.post('/register', registerSubadmin);

export default router;
