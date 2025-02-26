import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const JWT_SECRET = process.env.JWT_SECRET;

export async function encrypt(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: payload.expiresIn });
}