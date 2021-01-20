const {
    clientJoin,
    driverJoin,
    driverLeave,
    clients,
    drivers
  } = require('./utils/users');

module.exports = (io) => {
    console.log("OUI");
    io.on('connection', socket => {
        console.log("new connection");
        socket.on('driverJoin', (driver) => {
            driverJoin(socket.id, driver);
            socket.emit("driverConnected");
            console.log("connect");
            console.log(drivers);
        });

        socket.on('driverLeave', (driver) => {
            driverLeave(driver);
            console.log("disconnect");
            console.log(drivers);
        })

        socket.on('clientJoin', ({client}) => {
            clientJoin(socket.id, client);
        })
    })
}