const fs = require('node:fs');

class Init {
    init() {
        if (!fs.existsSync(process.env.NODE_DB_FOLDER)) {
            fs.mkdirSync(process.env.NODE_DB_FOLDER);
        }

        if (!fs.existsSync(process.env.NODE_DB_TTL_FOLDER)) {
            fs.mkdirSync(process.env.NODE_DB_TTL_FOLDER);
        }
    }
}

module.exports = new Init();
