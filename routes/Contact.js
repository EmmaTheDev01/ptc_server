import express from 'express';
import { createContact, getContacts } from '../controllers/contactController.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// Route for creating a new contact
router.post('/send', createContact);

// Route for getting all contacts
router.get('/', verifyAdmin, getContacts);

export default router;
