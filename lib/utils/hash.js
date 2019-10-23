const crypto = require('crypto');

module.exports = {
  md5(data) {
    return crypto.createHash('md5').update(data).digest('hex');
  },
  randomString(len) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = len; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  },
};
