const fs = require('node:fs');

class AllKeysCommand {
    handle(requestData) {
        const files = fs.readdirSync(process.env.NODE_DB_FOLDER);
        return files.join('; ');
    }
}

module.exports = new AllKeysCommand();
