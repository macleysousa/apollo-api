import * as dotenv from 'dotenv';
import { AES, enc } from 'crypto-js';

dotenv.config();

const { SECRET_KEY } = process.env;

if (!SECRET_KEY) {
  throw new Error('secret key not declared');
}

export function encrypt(value: string) {
  return AES.encrypt(value, SECRET_KEY).toString();
}

export function decrypt(value: string) {
  try {
    const bytes = AES.decrypt(value, SECRET_KEY);
    return bytes.toString(enc.Utf8);
  } catch {
    return null;
  }
}
