import bcrypt from 'bcryptjs';

export const verifyPassword = async (inputPassword, storedHash) => {
    try {
        return await bcrypt.compare(inputPassword, storedHash);
    } catch (error) {
        console.error("Error verifying password:", error.message);
        return false;
    }
};

// Verify Two-Step Code
export const verifyTwoStep = async (inputCode, storedHash) => {
    try {
        return await bcrypt.compare(inputCode, storedHash);
    } catch (error) {
        console.error("Error verifying two-step authentication:", error.message);
        return false;
    }
};