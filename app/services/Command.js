const fs = require('node:fs');

const SaveKeyCommand = require('./commands/SaveKeyCommand');
const GetKeyCommand = require('./commands/GetKeyCommand');
const DeleteKeyCommand = require('./commands/DeleteKeyCommand');

const isJSON = require('./../utils/isJSON.js');

class Command {
    commands = {
        "save_key": SaveKeyCommand,
        "get_key": GetKeyCommand,
        "delete_key": DeleteKeyCommand,
    };

    handle(requestData) {
        if (!isJSON(requestData)) {
            throw new Error('Wrong request. JSON expect.');
        }
    
        requestData = JSON.parse(requestData);
    
        if (!requestData?.action) {
            throw new Error('Wrong request. Expect action field.');
        }

        if (!fs.existsSync(process.env.NODE_DB_FOLDER)) {
            fs.mkdirSync(process.env.NODE_DB_FOLDER);
        }

        const command = this.commands[requestData.action] ?? null;
        if (command === null) {
            throw new Error('Wrong request. Unexpect action.');
        }

        return command.handle(requestData);
    }
}

module.exports = new Command();
