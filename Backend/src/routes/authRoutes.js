const router = require("express").Router();
const { registerRules, loginRules } = require("../utils/validators");
const authController = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

// Brute-force limiter for login
const loginLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 20 });

router.post("/register", registerRules, authController.register);
router.post("/login", loginLimiter, loginRules, authController.login);

module.exports = router;