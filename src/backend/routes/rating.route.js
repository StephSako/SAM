var express  = require("express");
const rating = require("../controller/RatingController");
var router = express.Router();

//Add rating
router.post("/add", rating.add);

module.exports = router;




