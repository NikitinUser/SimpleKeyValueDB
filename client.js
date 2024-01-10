var net = require('net');

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const port = 8080;
const host = "0.0.0.0";

const server_login = 'root';
const server_pwd = 'root';

console.log("write exit or ctrl + z for quit");

var client = new net.Socket();
client.connect(port, host, function() {
	console.log('Connected');
    client.write(server_login + " " + server_pwd);
});

client.on('data', function(data) {
	console.log('Received: ' + data);
});

client.on('close', function() {
	console.log('Connection closed');
    client.destroy();
    process.exit();
});

const rl = readline.createInterface({ input, output });

rl.on('line', (input) => {
    let inputArr = input.split(' ');

    const action = inputArr[0] ?? null;
    const key = inputArr[1] ?? null;
    const value = getValue(inputArr);

    client.write(JSON.stringify(
        {
            "action": action,
            "key": key,
            "value": value
        }
    ));
});

function getValue(inputArr) {
    if ((inputArr[2] ?? null) === null) {
        return null;
    }

    let value = inputArr[2];

    if (inputArr.length > 3) {
        for (let i = 3; i < inputArr.length; i++) {
            value += " " + inputArr[i];
        }
    }

    return value;
}
