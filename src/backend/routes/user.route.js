var express  = require("express");
const user = require("../controller/UserController");
var router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './src/assets/uploads'
});

//Register route
router.post("/register", user.register);

// Add profile pic
router.post('/profile_pic/upload/:userId', multipartMiddleware, user.uploadProfilePic);

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




