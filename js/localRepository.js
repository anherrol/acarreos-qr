export function LocalRepository () {
    const DB_NAME = "acarreos-local-db";
    
    var db = new Dexie(DB_NAME);

    function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11)
            .replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    }

    const EntryTypes = {
        Error: 0, 
        Normal: 1
    }

    // Define a schema
    db.version(1.4).stores({
            trucks: 'id, qrcode, description', 
            drivers: 'id, qrcode, description', 
            gondolas: 'id, qrcode, description', 
            operators: 'id, qrcode, description', 
            parameters: 'id, value', 
            jobplaces: 'id, nombre, prefijoBoletas, lugarOrigen, numeroFrente, numeroLote, esMina', 
            logentries: '++logId, logEntry, logDate, entryType'
        });

    // Open the database
    db.open()
        .catch(function(error){
            alert('Uh oh: ' + error);
        });

    this.Parameters = function () {
        this.storeParameter = async function (name, data) {
            await db.parameters.put({id: name, data: data});
        }

        this.getParameter = async function (name) {
            return await db.parameters.where({id: name}).first();
        }

        this.deleteParameter = async function (name) {
            await db.parameters.delete(name);
        }
    }

    this.Catalogs = function () {
        // Job Places
        this.storeJobPlaces = async function (data) {
            await db
                .jobplaces
                .put({ id: data.id, nombre: data.nombre, prefijoBoletas: data.prefijoBoletas, lugarOrigen: data.lugarOrigen, numeroFrente: data.numeroFrente, numeroLote: data.numeroLote, esMina: data.esMina });
        }

        this.getJobPlaces = async function () {
            return await db.jobplaces.toArray();
        }

        // Trucks
        this.storeTrucks = function (data) {
            db.trucks
                .put({ id: data.id, qrcode: data.qrCode, description: data.description })
                .catch((error) => {
                    console.error("Failed to add new truck. Error: " + error);
                    return Promise.reject(error);
                });
        }

        this.getTrucks = async function () {
            return await db.trucks.toArray();
        }

        // Drivers
        this.storeDrivers = function (data) {
            db.drivers
                .put({ id: data.id, qrcode: data.qrCode, description: data.description })
                .catch((error) => {
                    console.error("Failed to add new driver. Error: " + error);
                    return Promise.reject(error);
                });
        }

        // Gondolas
        this.storeGondolas = function (data) {
            db.gondolas
                .put({ id: data.id, qrcode: data.qrCode, description: data.description })
                .catch((error) => {
                    console.error("Failed to add new gondola. Error: " + error);
                    return Promise.reject(error);
                });
        }

        this.getGondolas = async function () {
            return await db.gondolas.toArray();
        }

        // operators
        this.storeOperators = function (data) {
            db.operators
                .put({ id: data.id, qrcode: data.qrCode, description: data.description })
                .catch((error) => {
                    console.error("Failed to add new operator. Error: " + error);
                    return Promise.reject(error);
                });
        }

        // machinery
        this.storeMachines = function (data) {
            db.machines
                .put({ id: data.id, qrcode: data.qrCode, description: data.description })
                .catch((error) => {
                    console.error("Failed to add new machine. Error: " + error);
                    return Promise.reject(error);
                });
        }

        this.getMachines = async function() {
            return await db.machines.toArray();
        }

        // Machine operators
        this.storeMachineOperators = function (data) {
            db.machineoperators
                .put({ id: data.id, qrcode: data.qrCode, description: data.description })
                .catch((error) => {
                    console.error("Failed to add new machine operator. Error: " + error);
                    return Promise.reject(error);
                });
        }

        // Event Types
        this.storeEventTypes = function (data) {
            db.eventtypes
                .put({ id: data.id, qrcode: data.qrCode, description: data.description })
                .catch((error) => {
                    console.error("Failed to add new event type. Error: " + error);
                    return Promise.reject(error);
                });
        }
        
        this.getEventTypes = function (data) {
            return db.eventtypes.toArray();
        }
    }

    this.LogEntries = function () {
        this.storeLogError = async function (logError) {
            await db
                .logentries
                .put({ logEntry: logError, logDate: new Date(), entryType: EntryTypes.Error });
        }

        this.storeLogEntry = async function (logEntry) {
            await db
                .logentries
                .put({ logEntry: logEntry, logDate: new Date(), entryType: EntryTypes.Normal });
        }

        this.deleteLogEntry = async function (id) {
            await db
                .logEntries
                .where('logId')
                .equals(id)
                .delete();
        }

        this.getLocalLogEntries = async () => {
            return await db.logentries.toArray();
        }
    }

    this.parameters = new this.Parameters();
    this.catalogs = new this.Catalogs();
    this.logEntries = new this.LogEntries();
}
