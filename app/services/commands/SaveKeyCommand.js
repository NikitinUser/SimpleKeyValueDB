const fs = require('node:fs');

const validateKey = require('./../../utils/validateKey.js');

class SaveKeyCommand {
    handle(requestData) {
        if (!requestData?.key) {
            throw new Error('Wrong request. Expect key field.');
        }

        if (!requestData?.value) {
            throw new Error('Wrong request. Expect value field.');
        }

        const valueSize = (new Blob([requestData.value]).size) / 1024 / 1024;
        if (valueSize > process.env.NODE_DB_MAX_VALUE_MB) {
            throw new Error(`Value size ${valueSize} MB, max value ${process.env.NODE_DB_MAX_VALUE_MB} MB`);
        }

        const stats = fs.statSync(process.env.NODE_DB_FOLDER);
        const folderSize = (stats.size / 1024 / 1024) + valueSize;
        if (folderSize > process.env.NODE_DB_MAX_FOLDER_MB) {
            throw new Error(`Folder size with value ${folderSize} MB, max folder size ${process.env.NODE_DB_MAX_FOLDER_MB} MB`);
        }

        validateKey(requestData?.key);

        fs.writeFile(process.env.NODE_DB_FOLDER + requestData.key, requestData.value, err => {
            if (err) {
                throw err;
            }
        });
        return '';
    }
}

module.exports = new SaveKeyCommand();
