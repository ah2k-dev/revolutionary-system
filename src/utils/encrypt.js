const crypto = require("crypto");

class Encrypter {
  constructor(encryptionKey) {
    this.algorithm = "aes-192-cbc";
    this.key = crypto.scryptSync(encryptionKey, "salt", 24);
    this.iv = crypto.randomBytes(16);
  }
  encrypt(clearText) {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    const encrypted =
      cipher.update(clearText, "utf8", "hex") + cipher.final("hex");
    return encrypted;
  }

  dencrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    const decrypted =
      decipher.update(encryptedText, "hex", "utf8") + decipher.final("utf8");
    return decrypted;
  }
}
const encrypter = new Encrypter("@16*74#2()1");
module.exports = encrypter;
// const clearText = "64e663d2cd6392181ac991ba";
// const encrypted = encrypter.encrypt(clearText);
// const decrypted = encrypter.dencrypt(encrypted);
// encrypter.encrypt(clearText);
// encrypter.dencrypt(encrypted);
// console.log(encrypted);
// console.log(decrypted);

// var crypto = require("crypto");
// var algorithm = "aes-192-cbc"; //algorithm to use
// var secret = "@16*74#2()1";
// const key = crypto.scryptSync(secret, "salt", 24); //create key
// console.log(key);
// var text = "64e663d2cd6392181ac991ba"; //text to be encrypted

// const iv = crypto.randomBytes(16); // generate different ciphertext everytime
// const cipher = crypto.createCipheriv(algorithm, key, iv);
// var encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex"); // encrypted text

// const decipher = crypto.createDecipheriv(algorithm, key, iv);
// var decrypted =
//   decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8"); //deciphered text
// console.log(encrypted);
// console.log(decrypted);

// module.exports = { encrypted, decrypted };
