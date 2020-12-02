const Sequelize = require("sequelize")
const db = require("../db.js")

module.exports = db.sequelize.define(
    'role_user',
    {
        id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            primaryKey: true,
            autoIncrement: true
        },
        label: {
            type: Sequelize.STRING
        },
        icon: {
            type: Sequelize.STRING
        }
    },
    {
        timestamps: 0,
        freezeTableName: 1,
        underscored: true,
        camelCase: false
    }
)
