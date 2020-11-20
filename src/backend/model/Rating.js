const Sequelize = require("sequelize")
const db = require("../db.js")
const Ride = require("../model/Ride")


module.exports = db.sequelize.define(
    'rating',
    {
        id_rating: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: true,
            autoIncrement: true
        },
        note: {
            type: Sequelize.STRING,
            allowNull: false
        },
        comment: {
            type: Sequelize.STRING,
            allowNull: false
        },
        ride_id_ride: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Ride,
                key: 'id_ride'
            }
        },
    },
    {
        timestamps: false,
        freezeTableName: 1,
        underscored: true,
        camelCase: false
    }
)
