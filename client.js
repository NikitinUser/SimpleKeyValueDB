var net = require('net');

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const port = 8080;
const host = "0.0.0.0";

console.log("write exit or ctrl + z for quit");

var client = new net.Socket();
client.connect(port, host, function() {
	console.log('Connected');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
});

client.on('close', function() {
	console.log('Connection closed');
});

const rl = readline.createInterface({ input, output });

rl.on('line', (input) => {
    let inputArr = input.split(' ');

    client.write(JSON.stringify(
        {
            "action": inputArr[0] ?? null,
            "key": inputArr[1] ?? null,
            "value": inputArr[2] ?? null
        }
    ));
}); 
