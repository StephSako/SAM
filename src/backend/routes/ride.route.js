var express  = require("express");
const ride = require("../controller/RideController");
var router = express.Router();

//Add a ride
router.post("/add", ride.add)

//Delete a ride
router.get("/delete/:id", ride.delete)

//Get one ride
router.get("/get/:id", ride.get)

//Get all ride
router.get("/get", ride.getAll)

module.exports = router;




