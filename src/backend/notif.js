const {
    clientJoin,
    driverJoin,
    driverLeave,
    clients,
    drivers,
    findDriverById
  } = require('./utils/users');

module.exports = (io) => {
    io.on('connection', socket => {
        console.log("new connection");

        /**
         * Connection socket management
         */

        //Check if driver already connected with socket
        socket.on("isConnected", (driver) => {
            if(findDriverById(driver.id_user)) {
                console.log("FOUND")
                socket.emit("driverConnected");
            } else {
                socket.emit("driverDisconnected")
            }
        })

        //Save the new connected driver
        socket.on('driverJoin', (driver) => {
            driverJoin(socket.id, driver);
            socket.emit("driverConnected");
            console.log("connect");
            console.log(drivers);
        });

        //Delete the driver
        socket.on('driverLeave', (driver) => {
            driverLeave(driver);
            console.log("disconnect");
            console.log(drivers);
        })

        socket.on('clientJoin', ({client}) => {
            clientJoin(socket.id, client);
        })

        /**
         * Manage course
         */

        //Notify the driver
        socket.on('newCourse', (driver, address, clientAddress, client) => {
            console.log(address);
            driverToNotify = findDriverById(driver.id_user);
            socket_id = driverToNotify.id;
            console.log(socket_id);
            io.to(socket_id).emit('driverCourse', {address, clientAddress, client})

        })
    })
}