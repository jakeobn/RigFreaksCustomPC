import crypto from 'crypto';
import { promisify } from 'util';

// Convert callback-based scrypt to promise-based
const scryptAsync = promisify(crypto.scrypt);

// Hash a password with a random salt
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  const password = 'admin123';
  const hashedPassword = await hashPassword(password);
  console.log(hashedPassword);
}

main().catch(console.error);