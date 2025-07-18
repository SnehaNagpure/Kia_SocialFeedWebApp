const express = require('express');
const router = express.Router();
 const usercontroller= require('../Controllers/usercontroller');


router.post('/create', usercontroller.createUser);
router.post('/login', usercontroller.loginUser); 
router.post('/users/:id/follow', usercontroller.followUser);
router.post('/users/:id/unfollow', usercontroller.unfollowUser);

module.exports = router;
