// backend/src/utils/validators.js
const { body } = require("express-validator");

// Shared password strength rule (mirrors front-end, but authoritative here)
const passwordStrength = body("password")
  .isString()
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  .matches(/[A-Za-z]/).withMessage("Password must include a letter")
  .matches(/\d/).withMessage("Password must include a number");

// Email for register & login (we accept email on login; if you also support username, see below)
const emailField = body("email")
  .isEmail().withMessage("Email must be valid")
  .normalizeEmail();

// optional: username for register
const usernameField = body("username")
  .optional()
  .isLength({ min: 3, max: 40 }).withMessage("Username must be 3–40 chars")
  .isAlphanumeric().withMessage("Username must be alphanumeric");

// Register rules: require email + password (+ optional username)
const registerRules = [
  body("email").isEmail().withMessage("Email must be valid").normalizeEmail(),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Za-z]/).withMessage("Password must include a letter")
    .matches(/\d/).withMessage("Password must include a number"),
];

// Login rules: require email and a non-empty password
// NOTE: Do NOT .escape() password on the server — it changes the string and breaks bcrypt.
// Trimming is fine if you’ve documented that passwords cannot start/end with spaces.
// Many apps choose to NOT trim to avoid altering user input. Below: no trim.
const loginRules = [
  emailField,
  body("password").isString().notEmpty().withMessage("Password is required"),
];

module.exports = { registerRules, loginRules };