class Auth {
    auth(chunk) {
        let credentials = chunk.trim().split(' ');
    
        const login = credentials[0] ?? null;
        const password = credentials[1] ?? null;
    
        if (login !== process.env.NODE_SERVER_LOGIN || password !== process.env.NODE_SERVER_PWD) {
            throw new Error('401 Unauthorized');
        }
    }
}

module.exports = new Auth();
