var express  = require("express");
const user = require("../controller/UserController");
var router = express.Router();

//Register route
router.post("/register", user.register);

//Login route
router.post("/login", user.login);

//Get connected user profile
router.get("/profile", user.profile);

//Edit profile
router.put("/edit/:id_user", user.edit);

module.exports = router;




