const express = require('express');
const router = express.Router();

const retailerController = require("../controllers/retailerController")

// Get retailers who have a single wholesaler
router.get('/single-wholesaler', retailerController.getRetailersWithSingleWholesaler);

module.exports = router;
