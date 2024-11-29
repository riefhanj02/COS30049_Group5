const crypto = require('crypto');
require('dotenv').config();

const aesKey = Buffer.from(process.env.AES_KEY, 'hex');
const aesIV = Buffer.from(process.env.AES_IV, 'hex');

function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, aesIV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Encrypt latitude and longitude
const latitude = "37.7749"; // Example latitude
const longitude = "-122.4194"; // Example longitude

const encryptedLatitude = encrypt(latitude);
const encryptedLongitude = encrypt(longitude);

console.log('Encrypted Latitude:', encryptedLatitude);
console.log('Encrypted Longitude:', encryptedLongitude);
