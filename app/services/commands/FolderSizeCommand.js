const fs = require('node:fs');

class FolderSizeCommand {
    handle(requestData) {
        const stats = fs.statSync(process.env.NODE_DB_FOLDER);
        return (stats.size / 1024 / 1024) + " MB";
    }
}

module.exports = new FolderSizeCommand();
