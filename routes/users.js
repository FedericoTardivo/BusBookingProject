import express from 'express';

import {createUser} from '../controllers/users.js';

const router = express.Router();

// POST: Register a new user
router.post('/', createUser);

export default router;