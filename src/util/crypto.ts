import { ECBEncryptor, ECBDecryptor } from 'aes-ts';

// 去掉拼接
function addPadding(msg: string) {
  if (msg.length % 16 === 0) {
    return msg
  }
  const repeated = 16 - (msg.length % 16);
  const r = String.fromCharCode(repeated);
  return msg + r.repeat(repeated);
}
function unPadding(msg: string): string {
  if (msg.length === 0) { return msg };
  const lastChar = msg.charCodeAt(msg.length - 1);
  if (lastChar < 16) {
    return msg.slice(0, msg.length - lastChar);
  }
  return msg
}

// 对称加密
export const encrypt = (data: string, secret: string) => {
  const e = new ECBEncryptor(Buffer.from(secret));
  const bs = e.encrypt(Buffer.from(addPadding(data), 'utf8'));
  return Buffer.from(bs).toString('base64');
}

// 对称解密
export const decrypt = (data: string, secret: string) => {
  const e = new ECBDecryptor(Buffer.from(secret));
  const b = e.decrypt(Buffer.from(data, 'base64'));
  return unPadding(Buffer.from(b).toString('utf8'));
}
