import { Router } from 'express';
import { checkUserState, login, logout, register } from '../controllers/auth.controller.js'
import { authUser } from '../middlewares/authen.middleware.js';
import { getUserProfile, toggleFollowArtist, toggleWishlist, updateUserProfile } from '../controllers/user.controller.js';

export const router = Router()

router.post('/register', register);

router.post('/login' , login);

router.post('/logout', logout);

router.get('/auth/me', authUser, checkUserState);

//Get user profile

router.get('/profile',authUser, getUserProfile);

//Update basic profile

router.put('/profile' ,authUser, updateUserProfile);

//favorute artist tooggle route;
router.patch('/artists/:artistId/follow',authUser,toggleFollowArtist);

//add item to wishlist tooggle route;
router.patch('/products/:productId/wishlist',authUser,toggleWishlist);

