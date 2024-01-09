const fs = require('node:fs');

const validateKey = require('./../../utils/validateKey.js');

class DeleteKeyCommand {
    handle(requestData) {
        if (!requestData?.key) {
            throw new Error('Wrong request. Expect key field.');
        }

        validateKey(requestData?.key);

        return this.deleteKey(requestData.key);
    }

    deleteKey(key) {
        fs.unlinkSync(process.env.NODE_DB_FOLDER + key);

        return '';
    }
}

module.exports = new DeleteKeyCommand();
