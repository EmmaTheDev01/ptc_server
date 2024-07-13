import express from 'express';
import { deleteUser, findAllUsers, findUser, updateUser, updateUserBalance } from '../controllers/userController.js';
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

router.put("/:id", verifyUser, updateUser);
router.delete("/:id", verifyAdmin, deleteUser);
router.get("/:id", verifyUser, findUser);
router.get("/", verifyAdmin, findAllUsers);
router.put("/updatebalance/:id", verifyAdmin, updateUserBalance);

export default router;
