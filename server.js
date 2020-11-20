const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')
const app = express()
const Role = require("./src/backend/model/Role")
const User = require("./src/backend/model/User")
const Ride = require("./src/backend/model/Ride")
const Rating = require("./src/backend/model/Rating")

process.env.SECRET_KEY = 'secret'

app.use(session({
    secret: 'riding_center',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var corsParam = {
    credentials: true,
    origin: "http://localhost:4200"
};

app.use(cors(corsParam))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

const path = require('path')
app.use(express.static(path.join(__dirname, 'dist/')))

app.get('/api', function (req, res) {
    res.json({ status: 'Working' })
})

Role.hasMany(User)
User.belongsTo(Role)

User.hasMany(Ride);
Ride.belongsTo(User, {
    foreignKey: {
        name:'id_client',
    }
});

Ride.belongsTo(User, {
    foreignKey: {
        name:'id_driver',
    }
});

Ride.hasOne(Rating, {
    onDelete:'CASCADE',
});
Rating.belongsTo(Ride, {
    foreignKey: {
        name:'id_ride'
    }
});


let UserRoute = require('./src/backend/routes/user.route')
app.use('/api/user', UserRoute)

let RoleRoute = require('./src/backend/routes/role.route')
app.use('/api/role', RoleRoute)

let RideRoute = require('./src/backend/routes/ride.route')
app.use('/api/ride', RideRoute)

let RatingRoute = require('./src/backend/routes/rating.route')
app.use('/api/rating', RatingRoute)

let port = process.env.PORT || 4000
app.listen(port, function () {
    console.log('Express server listening on port ' + port)
})
