const {
    clientJoin,
    driverJoin,
    driverLeave,
    clients,
    drivers,
    findDriverById,
    findClientById
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
            io.to("clientRoom").emit('driversUpdate', drivers);
            console.log("connect");
            console.log(drivers);
        });

        //Delete the driver
        socket.on('driverLeave', (driver) => {
            driverLeave(driver);
            console.log("disconnect");
            io.to("clientRoom").emit('driversUpdate', drivers);
            console.log(drivers);
        })

        //Send online drivers to new connection client
        socket.on('clientJoin', (client) => {
            clientJoin(socket.id, client);
            socket.join("clientRoom");
            socket.emit("driversMap", drivers);
            console.log(drivers)
        });

        /**
         * Manage course
         */

        //Notify the driver
        socket.on('newCourse', (driver, address, clientAddress, client, lat, lon, originLat, originLon) => {
            clientJoin(socket.id, client);
            driverToNotify = findDriverById(driver.id_user);
            time_text = driver.client_time_text;
            socket_id = driverToNotify.id;
            console.log(originLon);
            console.log(originLat);
            io.to(socket_id).emit('driverCourse', {address, clientAddress, client, time_text, lat, lon, originLat, originLon});

        })

        socket.on("sendRoute", (stepPoints, driver, client) => {
            driverToNotify = findDriverById(driver.id_user);
            clientToNotify = findClientById(client.id_user);
            socket_id = driverToNotify.id;
            socket_id_client = clientToNotify.id;
            let i = 0;
            for(let key in stepPoints) {
                i++
                setTimeout(() => {
                    io.to(socket_id).emit("step", stepPoints[key]);
                    io.to(socket_id_client).emit("step", stepPoints[key]);
                    
                }, i * 200)
            }
        });
    })
}