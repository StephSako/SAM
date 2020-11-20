const express  = require("express");
const ride = require("../controller/RideController");
const router = express.Router();

//Add a ride
router.post("/add", ride.add)

//Delete a ride
router.get("/delete/:id", ride.delete)

//Get one ride
router.get("/get/:id", ride.get)

//Get all specific driver's ratings
router.get("/get/all_driver_ratings/:id_driver", ride.getAllDriverRatings);

//Get specific driver's average ratings
router.get("/get/average_driver_ratings/:id_driver", ride.getAverageDriverRatings);

module.exports = router;




