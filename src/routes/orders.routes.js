import { Router } from 'express';
import { createOrder } from '../controllers/order.controller.js';
import { authUser } from '../middlewares/authen.middleware.js';

export const router = Router();

router.post('/orders', authUser, createOrder);
