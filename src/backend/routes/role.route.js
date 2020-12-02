var express  = require("express");
const role = require("../controller/RoleController");
var router = express.Router();

//Get all role
router.get("/", role.getAll);

module.exports = router;




