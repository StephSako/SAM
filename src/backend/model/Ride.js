const Sequelize = require("sequelize")
const db = require("../db.js")
const User = require("../model/User")

module.exports = db.sequelize.define(
    'ride',
    {
        id_ride: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_client: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id_user',
                as: 'client'
            }
        },
        id_driver: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id_user'
            },
            as: 'driver'
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false
        },
        is_completed: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        timestamps: 0,
        freezeTableName: 1,
        underscored: true,
        camelCase: false
    }
)
