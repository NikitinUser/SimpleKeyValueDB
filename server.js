const Net = require('net');
const fs = require('node:fs');

const port = 8080;
const host = "0.0.0.0";

const server_login = 'root';
const server_pwd = 'root';

const folderpath = './db';

global.clients = {};

const server = new Net.Server();

server.listen(port, host, function() {
    console.log(`Server listening for connection requests on socket ${host}:${port}`);
});

if (!fs.existsSync(folderpath)) {
    fs.mkdirSync(folderpath);
}

server.on('connection', function(socket) {
    const clientIdentify = socket.remoteAddress + "_" + socket.remotePort;

    socket.on('data', function(chunk) {
        if (!(global.clients[clientIdentify] ?? null)) {
            try {
                auth(chunk.toString());
            } catch (e) {
                socket.write(e.message);
                socket.destroy();
                return;
            }

            global.clients[clientIdentify] = socket;
            console.log('A new connection has been established. ' + clientIdentify);
            return;
        }

        try {
            const result = processData(chunk.toString());
            socket.write(result);
        } catch (e) {
            socket.write('error: ' + e.message);
        }
    });

    socket.on('end', function() {
        delete global.clients[clientIdentify];
    });

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});

function processData(requestData) {
    if (!isJSON(requestData)) {
        throw new Error('Wrong request. JSON expect.');
    }

    requestData = JSON.parse(requestData);

    if (!requestData?.action) {
        throw new Error('Wrong request. Expect action field.');
    }

    if (requestData.action === "save_key") {
        if (!requestData?.key) {
            throw new Error('Wrong request. Expect key field.');
        }

        if (!requestData?.value) {
            throw new Error('Wrong request. Expect value field.');
        }

        saveKey(requestData.key, requestData.value);
        return '';
    } else if (requestData.action === "get_key") {
        if (!requestData?.key) {
            throw new Error('Wrong request. Expect key field.');
        }

        return getKey(requestData.key);
    } else if (requestData.action === "delete_key") {
        if (!requestData?.key) {
            throw new Error('Wrong request. Expect key field.');
        }

        deleteKey(requestData.key);
        return '';
    } else {
        throw new Error('Wrong request. Unexpect action.');
    }
}

function isJSON(text) {
    if (typeof text !== "string") {
        return false;
    }
    try {
        JSON.parse(text);
        return true;
    } catch (error) {
        return false;
    }
}

function saveKey(key, value) {
    fs.writeFile(folderpath + key, value, err => {
        if (err) {
            console.error(err);
        }
    });
}

function getKey(key) {
    if (!fs.existsSync(folderpath + key)) {
        return '';
    }

    const buffer = fs.readFileSync(folderpath + key);
    return buffer;
}

function deleteKey(key) {
    fs.unlinkSync(folderpath + key);
}

function auth(chunk) {
    let credentials = chunk.trim().split(' ');

    const login = credentials[0] ?? null;
    const password = credentials[1] ?? null;

    if (login !== server_login || password !== server_pwd) {
        throw new Error('401 Unauthorized');
    }
}
