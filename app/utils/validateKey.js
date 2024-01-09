module.exports = function validateKey(inputString) {
    if (inputString.length > 200) {
        throw new Error('The key\'s length must be <= 200 chars.');
    }

    const regex = /^[A-Za-z0-9_\- ]+$/;
    if (!regex.test(inputString)) {
        throw new Error('The key must contain only characters A-Za-z0-9_ -');
    }

    return true;
}
