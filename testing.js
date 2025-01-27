import bcrypt from 'bcryptjs';

// Example plain text values
const password = "secure_password123";
const twoStepCode = "auth_code_456";

// Generate bcrypt hashes
const pwdHash = bcrypt.hashSync(password, bcrypt.genSaltSync());
const twoStepHash = bcrypt.hashSync(twoStepCode, bcrypt.genSaltSync());

console.log("Password Hash:", pwdHash);
console.log("Two-Step Auth Code Hash:", twoStepHash);