const drivers = {};
const clients = {};

driverJoin = (id, driver) => {
    newDriver = {
        id_user: driver.id_user,
        firstname: driver.firstname,
        lastname: driver.lastname,
        email: driver.email,
        latitude_pos: driver.latitude_pos,
        longitude_pos: driver.longitude_pos,
        phone_number: driver.phone_number,
        id: id
    }
    drivers[id] = newDriver
    return newDriver;
} 

driverLeave = (driver) => {
    id = driver.id_user;
    removeDriver(id);
}

removeDriver = (id) => {
    for(let key in drivers) {
        driver = drivers[key];
        if(driver.id_user == id) {
            console.log("Remove driver")
            console.log(driver);
            delete drivers[key];
            return;
        }
    }
}

findDriverById = (id) => {
    let found = null;
    for(let key in drivers) {
        let driver = drivers[key];
        if(driver.id_user == id) {
            found = driver;
        }
    }
    return found;
}

findClientById = (id) => {
    let found = false;
    for(let key in clients) {
        let client = clients[key];
        if(client.id_user == id) {
            found = client;
        }
    }
    return found;
}



clientJoin = (id, client) => {
    if(!findClientById(client.id_user)) {
        newclient = {
            id_user: client.id_user,
            firstname: client.firstname,
            lastname: client.lastname,
            email: client.email,
            latitude_pos: client.latitude_pos,
            longitude_pos: client.longitude_pos,
            phone_number: client.phone_number,
            id: id
        }
        clients[id] = newclient
        return newclient;
    }
    console.log(clients);
    return client;
}

module.exports = {
    driverJoin,
    driverLeave,
    clientJoin,
    drivers,
    clients,
    findDriverById,
    findClientById
}