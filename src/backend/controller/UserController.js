const express = require('express')
const user = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../model/User")
const Role = require("../model/Role")
const { Op } = require("sequelize");
const nodemailer = require('nodemailer');
const btoa = require('btoa');
const atob = require('atob');


process.env.SECRET_KEY = 'secret'



// REGISTER
exports.register = (req, res) => {
    const userData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        phone_number: req.body.phone_number,
        role_user_id: req.body.role_user_id,
        email: req.body.email
    }
    userData.password = bcrypt.hashSync(userData.password, 12)
    User.create(userData).then(user => {
        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, { expiresIn: 1440 })
        res.json({token: token})
    }).catch(err => {
        if (err.errors[0].path === "unique_phone_number") res.status(401).send("Le numéro de télephone est déjà lié un compte existant")
        else if (err.errors[0].path === "unique_email") res.status(401).send("L'adresse email est déjà lié un compte existant")
        else res.status(401).send("Une erreur est survenue dans la mise à jour du compte")
    })
}

// LOGIN
exports.login = (req, res) => {
    User.findOne({
        where: {
            [Op.or]: [
                { email: req.body.login_user },
                { phone_number: req.body.login_user }
            ]
        },
        include: [Role]
    }).then(user => {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                expiresIn: 1440
            })
            res.json({token: token})
        } else res.status(401).send("Le mot de passe est incorrect")
    }).catch(err => {
        res.send(err)
        //res.status(500).send("Aucun compte associé à cet idenfitiant")
    })
}

// PROFILE
exports.profile = (req, res) => {
    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    User.findOne({
        where: {
            id_user: decoded.id_user
        },
        include: [Role]
    }).then(user => {
        if (user) res.send(user)
        else res.json({message: "Cet utilisateur est introuvable"})
    }).catch(err => {
        res.json({message: err})
    })
}


// EDIT
exports.edit = (req, res) => {
    const id_user = req.params.id_user;

    User.update(req.body, {
        where: { id_user: id_user}
    }).then(num => {

        if (num =! 0) {
            User.findOne({
                where: {
                    id_user: id_user
                },
                include: [Role]
            }).then(user => {
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440
                })
                res.json({token: token})
            }).catch(() => {
                res.status(500).send("Le compte modifié n'a pas été trouvé")
            })
        }
        else res.status(401).send("Le compte n'a pas été modifié")

    }).catch(err => {
        if (err.errors[0].path === "unique_phone_number") res.status(401).send("Le numéro de télephone a déjà été renseigné")
        else if (err.errors[0].path === "unique_email") res.status(401).send("L'adresse email a déjà été renseignée")
        else res.status(401).send("Une erreur est survenue dans la mise à jour du compte")
    })
}
