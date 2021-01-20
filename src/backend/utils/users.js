const drivers = [];
const clients = []

driverJoin = (id, driver) => {
    driver.id = id;
    drivers.push(driver);
    return driver;
} 

driverLeave = (driver) => {
    id = driver.id_user;
    removeDriver(id);
}

removeDriver = (id) => {
    drivers.forEach((driver, i) => {
        if(driver.id_user == id) {
            drivers.splice(i, 1);
            return;
        }
    })
}

findDriverById = (id) => {
    let found = null;
    drivers.forEach((driver) => {
        if(driver.id_user == id) {
            found = driver;
        }
    })
    return found;
}

clientJoin = (id, client) => {
    client.id = id;
    clients.push(id, client);
    return client;
}

module.exports = {
    driverJoin,
    driverLeave,
    clientJoin,
    drivers,
    clients,
    findDriverById
}