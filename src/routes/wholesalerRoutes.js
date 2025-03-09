const express = require('express');
const router = express.Router();

const wholesalerController = require("../controllers/wholesalerController")

// Get wholesaler with associated retailers
router.get('/:wholesaler_id/retailers', wholesalerController.getWholesalerWithRetailers);

// Total monthly turnover of each wholesaler for a complete year
router.get('/monthly-turnover', wholesalerController.getMonthlyTurnover);

// Max turnover of each wholesaler from a single retailer
router.get('/max-turnover', wholesalerController.getMaxTurnoverFromRetailer);

module.exports = router;
