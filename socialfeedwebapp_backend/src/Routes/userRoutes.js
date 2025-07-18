const express = require('express');
const router = express.Router();
 const usercontroller= require('../Controllers/usercontroller');
const upload = require('../Middlewares/upload');

router.post('/create', upload.single('profilePicture'), usercontroller.createUser);
router.post('/login', usercontroller.loginUser); 
router.put('/:id/follow', usercontroller.followUser);
router.put('/:id/unfollow', usercontroller.unfollowUser);
router.get('/:id', usercontroller.getUserById );
router.get('/by-username/:username', usercontroller.getUserByUsername );


module.exports = router;
