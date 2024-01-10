const fs = require('node:fs');

class SetTtlCommand {
    handle(requestData) {
        if (!requestData?.key) {
            throw new Error('Wrong request. Expect key field.');
        }

        if (!requestData?.value) {
            throw new Error('Wrong request. Expect value field.');
        }

        if (!fs.existsSync(process.env.NODE_DB_FOLDER + requestData.key)) {
            throw new Error(`Key ${requestData.key} not exist.`);
        }

        const digitRegex = /^\d+$/;
        if (!digitRegex.test(requestData.value)) {
            throw new Error('Wrong request. Expect int value in seconds.');
        }

        const expiredTime = parseInt(Date.now() / 1000) + parseInt(requestData.value);

        fs.writeFile(process.env.NODE_DB_TTL_FOLDER + requestData.key, `${expiredTime}`, err => {
            if (err) {
                throw err;
            }
        });

        return '';
    }
}

module.exports = new SetTtlCommand();
