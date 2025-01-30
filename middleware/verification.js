import bcrypt from "bcryptjs";

// Hashing
export const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// verify a hashed password
export const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Function to hash two-step authentication codes
export const hashTwoStepAuth = async (code) => {
    const saltRounds = 10;
    return await bcrypt.hash(code, saltRounds);
};

// Two Step Code for the Admin
export const verifyTwoStep = async (code, hashedCode) => {
    return await bcrypt.compare(code, hashedCode);
};
