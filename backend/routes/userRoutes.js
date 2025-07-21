import express from 'express';
import { loginUser, logoutUser, registerUser, verifyUser } from '../controller/userController.js';
import { isLoggedIn } from '../middlewares/userAuthMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', isLoggedIn, logoutUser);
router.get('/verify/:token', verifyUser);

export default router;