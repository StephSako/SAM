const express = require('express')
const ride = express.Router();
const _ = require('lodash');
const Ride = require("../model/Ride");
const jwt = require("jsonwebtoken");
const Rating = require('../model/Rating');

//Add ride
exports.add = (req, res) => {
    // Test if token exist
    // TODO Define global json response
    console.log(req.headers);
    jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, function (err, decoded) {
        if (err) {
            console.log(err)
            res.send("Vous n'etes pas connecté");
            return;
        }
        const rideData = {
            id_client: req.body.id_client,
            id_driver: req.body.id_driver,
            address: req.body.address,
        }

        console.log(rideData)

        Ride.create(rideData).then(ride => {
            res.send("Course créé");
        }).catch(err => {
            console.log(err);
            res.send("Erreur lors de la création de la course");
        })
    })
}

exports.delete = (req, res) => {
    let id = req.params.id;
    jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, function (err, decoded) {
        if (err) {
            console.log(err)
            res.send("Vous n'etes pas connecté");
            return;
        }
        Ride.destroy({
            where: {
                id_ride: id
            }
        })
            .then(result => {
                res.send("Course supprimé avec succès");
            })
            .catch(err => {
                console.log(err);
                res.send("Erreur lors de la suppression");
            })
    })
}

exports.get = (req, res) => {
    let id = req.params.id;
    jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, function (err, decoded) {
        if (err) {
            console.log(err)
            res.send("Vous n'etes pas connecté");
            return;
        }
        Ride.findOne({
            where: {
                id_ride: id
            },
            include: [Rating]
        }).then(ride => {
            if (ride) res.send(ride)
            else res.json({ message: "Cette course est introuvable" })
        }).catch(err => {
            res.json({ message: err })
        })
    })
}