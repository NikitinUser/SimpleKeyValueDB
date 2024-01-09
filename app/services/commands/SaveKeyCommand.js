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

        validateKey(requestData?.key);

        return this.saveKey(requestData.key, requestData.value);
    }

    saveKey(key, value) {
        fs.writeFileSync(process.env.NODE_DB_FOLDER + key, value);
        return '';
    }
}

module.exports = new SaveKeyCommand();
