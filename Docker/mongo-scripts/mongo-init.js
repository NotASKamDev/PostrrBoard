db = db.getSiblingDB("postrrboard")
disableTelemetry();
if (db.getCollectionNames().length < 1) {
    db.createCollection("users");
}


function setupDB() {
    db.createCollection("users");
}