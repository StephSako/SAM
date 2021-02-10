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
        socket.on('newCourse', (data) => {
            socket.join("courseRoom");
            console.log("DATA");
            console.log(data);
            driverToNotify = findDriverById(data.driver.id_user);
            socket_id = driverToNotify.id;
            console.log("driver socket id");
            console.log(socket_id);
            console.log("ORIGIN");
            console.log(data.originLat);
            console.log(data.originLon);
            io.to(socket_id).emit('driverCourse', data);

        })

        socket.on("sendRoute", (stepPoints, driver, client) => {
            socket.join("courseRoom")
            driverToNotify = findDriverById(driver.id_user);
            clientToNotify = findClientById(client.id_user);
            socket_id = driverToNotify.id;
            socket_id_client = clientToNotify.id;
            console.log("client socket");
            console.log(socket_id_client);
            let i = 0;
            let it = 1;
            for(let key in stepPoints) {
                i++
                setTimeout(() => {
                    it++
                    io.to("courseRoom").emit('step', stepPoints[key]);
                    /*io.to(socket_id).emit("step", stepPoints[key]);
                    io.to(socket_id_client).emit("step", stepPoints[key]);*/
                    console.log("it");
                    console.log(it);
                    if(Object.keys(stepPoints).length == it) {
                        if(stepPoints[key].endRoute) {
                            io.to("courseRoom").emit('courseFinished');
                        } else {
                            io.to("courseRoom").emit('driverArrived');
                        }
                        
                    }
                }, i * 100)

            }

            
        });
    })
}