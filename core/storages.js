import lokijs from "lokijs";


// NOTE @imblowfish: https://github.com/techfort/LokiJS/wiki
let users = null;

await new Promise((resolve) => {
    const db = new lokijs("./.config/storage.json", {
        autosave: true,
        autoload: true,
        autoloadCallback: initializeDatabase,
        verbose: true
    });

    function initializeDatabase() {
        users = db.getCollection("users") ?? db.addCollection("users", {
            indices: ["uuid"],
            unique: ["username"]
        });
        resolve();
    }
});

export {
    users as Users
};
