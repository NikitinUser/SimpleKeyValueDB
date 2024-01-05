const Net = require('net');
const fs = require('node:fs');

const port = 8080;
const host = "0.0.0.0";

global.clients = {};

const server = new Net.Server();

server.listen(port, host, function() {
    console.log(`Server listening for connection requests on socket ${host}:${port}`);
});

server.on('connection', function(socket) {
    const clientIdentify = socket.remoteAddress + "_" + socket.remotePort;

    global.clients[clientIdentify] = socket;

    console.log('A new connection has been established. ' + clientIdentify);

    socket.on('data', function(chunk) {
        try {
            const result = processData(chunk);
            socket.write(result);
        } catch (e) {
            socket.write('error: ' + e);
        }
    });

    socket.on('end', function() {
        delete global.clients[clientIdentify];
    });

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});

function processData(chunk) {
    let requestData = chunk.toString();
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
        return null;
    } else if (requestData.action === "get_key") {
        if (!requestData?.key) {
            throw new Error('Wrong request. Expect key field.');
        }

        const value = getKey(requestData.key);
        return value;
    } else if (requestData.action === "delete_key") {
        if (!requestData?.key) {
            throw new Error('Wrong request. Expect key field.');
        }

        deleteKey(requestData.key);
        return null;
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
    fs.writeFile('./db/' + key, value, err => {
        if (err) {
            console.error(err);
        }
    });
}

function getKey(key) {
    const buffer = fs.readFileSync('./db/' + key);
    return buffer;
}

function deleteKey(key) {
    fs.unlinkSync('./db/' + key);
}
