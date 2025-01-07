import CryptoJS from "crypto-js";

const aes_key = CryptoJS.enc.Utf8.parse("1234567890123456");

export const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(
        password,
        aes_key,
        {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }
    ).toString();
}

export const decryptPassword = (encryptedPassword) => {
    return CryptoJS.AES.decrypt(
        encryptedPassword,
        aes_key,
        {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }
    ).toString(CryptoJS.enc.Utf8);
}
