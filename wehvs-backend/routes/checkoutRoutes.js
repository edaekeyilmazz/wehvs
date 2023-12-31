const express = require("express");

const checkoutController = require("../controllers/checkoutController");

const router = express.Router();

router.post('/create-checkout-session', checkoutController.createCheckoutSession);
router.get('/session-status', checkoutController.sessionStatus);

module.exports = router;
