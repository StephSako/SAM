const app = require('express')()
const http = require('http').createServer(app);
options={
  cors:true,
 }
const io = require('socket.io')(http, options);
const notif = require('./src/backend/notif')(io)
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')
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
    origin: "http://localhost:4000"
};

const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100',
    'http://localhost:4000'
  ];

  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    }
  }

  app.options('*', cors(corsOptions));

app.get('/', cors(corsOptions), (req, res, next) => {
  res.json({ message: 'This route is CORS-enabled for an allowed origin.' });
})

app.use(cors(corsParam))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", 'true');
    next();
})

const path = require('path')

app.get('/api', function (req, res) {
    res.json({ status: 'Working' })
})

Role.hasMany(User)
User.belongsTo(Role)

User.hasMany(Ride, { foreignKey: 'id_client'});
User.hasMany(Ride, { foreignKey: 'id_driver'});
Ride.belongsTo(User, {
    foreignKey: {
        name:'id_client'
    },
    as: 'client'
});

Ride.belongsTo(User, {
    foreignKey: {
        name:'id_driver'
    },
    as: 'driver'
});

Ride.hasOne(Rating);
Rating.belongsTo(Ride);

let UserRoute = require('./src/backend/routes/user.route')
app.use('/api/user', UserRoute)

let RoleRoute = require('./src/backend/routes/role.route')
app.use('/api/role', RoleRoute)

let RideRoute = require('./src/backend/routes/ride.route')
app.use('/api/ride', RideRoute)

let RatingRoute = require('./src/backend/routes/rating.route')
app.use('/api/rating', RatingRoute)

let port = process.env.PORT || 4000
http.listen(port, function () {
    console.log('Express server listening on port ' + port)
})
