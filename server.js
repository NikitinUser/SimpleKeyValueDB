if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const Net = require('net');

const Auth = require('./app/services/Auth');
const Command = require('./app/services/Command');

const clients = {};

const server = new Net.Server();

server.listen(process.env.NODE_PORT, process.env.NODE_HOST, function() {
    console.log(`${process.env.NODE_HOST}:${process.env.NODE_PORT}`);
});

server.on('connection', function(socket) {
    const clientIdentify = socket.remoteAddress + "_" + socket.remotePort;

    socket.on('data', function(chunk) {
        if (!(clients[clientIdentify] ?? null)) {
            try {
                Auth.auth(chunk.toString());
                clients[clientIdentify] = clientIdentify;
            } catch (e) {
                socket.write(e.message);
                socket.destroy();
            } finally {
                return;
            }
        }

        try {
            const result = Command.handle(chunk.toString());
            socket.write(result);
        } catch (e) {
            socket.write('error: ' + e.message);
        }
    });

    socket.on('end', function() {
        delete clients[clientIdentify];
    });

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});
