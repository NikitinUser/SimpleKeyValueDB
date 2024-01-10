const SaveKeyCommand = require('./commands/SaveKeyCommand');
const GetKeyCommand = require('./commands/GetKeyCommand');
const DeleteKeyCommand = require('./commands/DeleteKeyCommand');
const AllKeysCommand = require('./commands/AllKeysCommand');
const FolderSizeCommand = require('./commands/FolderSizeCommand');
const SetTtlCommand = require('./commands/SetTtlCommand');

const isJSON = require('./../utils/isJSON.js');

class Command {
    commands = {
        "save_key": SaveKeyCommand,
        "get_key": GetKeyCommand,
        "delete_key": DeleteKeyCommand,
        "all_keys": AllKeysCommand,
        "db_size": FolderSizeCommand,
        "set_ttl": SetTtlCommand
    };

    handle(requestData) {
        if (!isJSON(requestData)) {
            throw new Error('Wrong request. JSON expect.');
        }
    
        requestData = JSON.parse(requestData);
    
        if (!requestData?.action) {
            throw new Error('Wrong request. Expect action field.');
        }

        const command = this.commands[requestData.action] ?? null;
        if (command === null) {
            throw new Error('Wrong request. Unexpect action.');
        }

        return command.handle(requestData);
    }
}

module.exports = new Command();
