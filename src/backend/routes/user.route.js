const express  = require("express");
const user = require("../controller/UserController");
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './src/backend/controller/uploads'
});

//Register route
router.post("/register", user.register);

// Upload profile pic
router.post('/profile_pic/upload/:userId/:profile_pic_name', multipartMiddleware, user.uploadProfilePic);

// Download profile pic
router.get('/profile_pic/download/:userId', user.downloadProfilePic);

//Login route
router.post("/login", user.login);

//Get connected user profile
router.get("/profile", user.profile);

//Edit profile
router.put("/edit/:id_user", user.edit);

//Update location
router.put("/edit/location/:id_user", user.editLocation);

//Get all drivers
router.get("/drivers", user.getDrivers);

module.exports = router;




