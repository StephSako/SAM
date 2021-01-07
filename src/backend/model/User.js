const Sequelize = require("sequelize")
const db = require("../db.js")
const RoleUser = require("../model/Role")

module.exports = db.sequelize.define(
    'users',
    {
        id_user: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: true,
            autoIncrement: true
        },
        firstname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        phone_number: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        role_user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: RoleUser,
                key: 'id'
            }
        }
    },
    {
        timestamps: false,
        freezeTableName: 1,
        underscored: true,
        camelCase: false,
        defaultScope: {
            attributes: { exclude: ['role_user_id', 'roleUserId'] }
        }
    }
)
