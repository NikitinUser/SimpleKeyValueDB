var net = require('net');

const port = 8080;
const host = "0.0.0.0";

var client = new net.Socket();
client.connect(port, host, function() {
	console.log('Connected');
	client.write(JSON.stringify(
        {
            "action": "get_key",
            "key": "test1",
            "value": "test_value"
        }
    ));
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	// client.destroy();
});

client.on('close', function() {
	console.log('Connection closed');
});
