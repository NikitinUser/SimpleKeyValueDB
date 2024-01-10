if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const fs = require('node:fs');

const Init = require('./app/services/Init');

Init.init();

while (true) {
    try {
        const files = fs.readdirSync(process.env.NODE_DB_TTL_FOLDER);
        checkFiles(files);
    } catch (e) {
        console.log(e);
    }
}

function checkFiles(files) {
    let nowStamp = Date.now() / 1000;

    for (let i = 0; i < files.length; i++) {
        const expiredStamp = fs.readFileSync(process.env.NODE_DB_TTL_FOLDER + files[i]);
        if (nowStamp >= expiredStamp) {
            fs.unlinkSync(process.env.NODE_DB_FOLDER + files[i]);
            fs.unlinkSync(process.env.NODE_DB_TTL_FOLDER + files[i]);
        }
    }
}
