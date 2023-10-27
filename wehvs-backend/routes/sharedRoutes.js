const express = require("express");

const sharedController = require("../controllers/sharedController");
const { loginSchema } = require("../payloads/sharedValidation");

const router = express.Router();

router.post("/login", loginSchema, sharedController.login);

module.exports = router;