const _ = require('lodash');
const Ride = require("../model/Ride");
const jwt = require("jsonwebtoken");
const Rating = require("../model/Rating");

//Add ride
exports.add = (req, res) => {
    // Test if token exist
    jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, function (err, decoded) {
        if (err) {
            res.send("Vous n'etes pas connecté");
            return;
        }
        const rideData = {
            id_client: req.body.id_client,
            id_driver: req.body.id_driver,
            address: req.body.address,
        }

        Ride.create(rideData).then(ride => {
            res.send("Course créée");
        }).catch(err => {
            res.send("Erreur lors de la création de la course");
        })
    })
}

exports.delete = (req, res) => {
    let id = req.params.id;
    jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, function (err) {
        if (err) {
            res.send("Vous n'etes pas connecté");
            return;
        }
        Ride.destroy({
            where: {
                id_ride: id
            }
        })
            .then(result => {
                res.send("Course supprimée avec succès");
            })
            .catch(err => {
                res.send("Erreur lors de la suppression");
            })
    })
}

exports.get = (req, res) => {
    let id = req.params.id;
    jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, function (err) {
        if (err) {
            res.send("Vous n'etes pas connecté");
            return;
        }
        Ride.findOne({
            where: {
                id_ride: id
            },
            include: {all:true}
        }).then(ride => {
            if (ride) res.send(ride)
            else res.json({ message: "Cette course est introuvable" })
        }).catch(err => {
            res.json({ message: err })
        })
    })
}

exports.getAllDriverRatings = (req, res) => {
    let id_driver = req.params.id_driver;
    jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, function (err) {
        if (err) {
            res.send("Vous n'etes pas connecté");
            return;
        }
        Ride.findAll({
            where: {
                id_driver: id_driver
            },
            include: {all:true},
            attributes: {exclude: ['id_client', 'id_driver', 'is_completed']},
        }).then(ratings => {
            if (ratings) res.send(ratings)
            else res.json({ message: "Ce conducteur n'a aucune note" })
        }).catch(err => {
            res.json({ message: err })
        })
    })
}

exports.getAverageDriverRatings = (req, res) => {
    let id_driver = req.params.id_driver;
    jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, function (err) {
        if (err) {
            res.send("Vous n'etes pas connecté");
            return;
        }
        Ride.findAll({
            where: {
                id_driver: id_driver
            },
            include: [Rating],
            attributes: {exclude: ['id_client', 'id_driver', 'is_completed', 'id_ride', 'address']},
        }).then(ratings => {
            if (ratings) res.json(_.meanBy(ratings, function(o) { return o.rating.note; }))
            else res.json({ message: "Ce conducteur n'a aucune note" })
        }).catch(err => {
            res.json({ message: err })
        })
    })
}
