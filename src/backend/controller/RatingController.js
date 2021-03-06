const express = require('express')
const rating = express.Router();
const _ = require('lodash');
const Rating = require("../model/Rating");
const jwt = require("jsonwebtoken")

exports.add = (req, res) => {
    // Test if token exist
    // TODO Define global json response
    jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, function (err, decoded) {
        if (err) {
            res.send("Vous n'etes pas connecté");
            return;
        }

        const ratingData = {
            ride_id_ride: req.body.id_ride,
            note: req.body.note,
            comment: req.body.comment
        }
    
        Rating.create(ratingData).then(rating => {
            res.send("Note ajoutée");
        }).catch(err => {
            res.send("Erreur lors de l'ajout de la note");
        })

    })
}
