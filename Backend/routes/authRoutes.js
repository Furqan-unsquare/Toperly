import express from 'express';
import { register, login, logout, changePassword, getUserDetails, getAllAdmins, updateUserInfo, deleteSubadmin, syncAuth0User, assignRole } from '../controllers/authController.js';
import { commonVerification, verifyAuth0Token } from '../middlewares/auth.middleware.js'; // Modified name

const router = express.Router();

router.post('/register', register); // Keep for custom if needed
router.post('/login', login); // Keep for custom if needed
router.post('/logout', logout);
router.post('/change-password', verifyAuth0Token, changePassword);
router.get('/me', verifyAuth0Token, commonVerification, getUserDetails);
router.put('/update', verifyAuth0Token, updateUserInfo);
router.post('/sync', verifyAuth0Token, syncAuth0User); // New
router.post('/assign-role', verifyAuth0Token, assignRole); // New
router.get('/users', getAllAdmins); // New route to fetch 
router.delete('/users/:id', deleteSubadmin); // DELETE endpoint to delete a subadmin

export default router;