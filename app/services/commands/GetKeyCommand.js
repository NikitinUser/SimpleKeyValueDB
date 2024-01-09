const fs = require('node:fs');

const validateKey = require('./../../utils/validateKey.js');

class GetKeyCommand {
    handle(requestData) {
        if (!requestData?.key) {
            throw new Error('Wrong request. Expect key field.');
        }

        validateKey(requestData?.key);

        return this.getKey(requestData.key);
    }

    getKey(key) {
        if (!fs.existsSync(process.env.NODE_DB_FOLDER + key)) {
            return '';
        }
    
        const buffer = fs.readFileSync(process.env.NODE_DB_FOLDER + key);
        return buffer;
    }
}

module.exports = new GetKeyCommand();
