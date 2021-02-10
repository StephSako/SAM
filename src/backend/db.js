const Sequelize = require("sequelize")
const db = {}
const sequelize = new Sequelize("stephsako_samcapprojet", "stephsako_cappro", "samcapprojet", {
    host: "mysql-stephsako.alwaysdata.net",
    dialect: "mysql",
    port : 3306,
    operatorsAliases: 0,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db