const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

/**
 * Hash a plain text password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = async (password) => {
  try {
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    console.log('Password hashed successfully');
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error.message);
    throw new Error('Failed to hash password');
  }
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} - True if passwords match
 */
const comparePassword = async (password, hashedPassword) => {
  try {
    console.log('Comparing password...');
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password comparison completed');
    return isMatch;
  } catch (error) {
    console.error('Error comparing password:', error.message);
    throw new Error('Failed to compare password');
  }
};

module.exports = {
  hashPassword,
  comparePassword
};