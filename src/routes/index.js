const express = require('express');
const router = express.Router();

// routes
const retailerRoutes = require("./retailerRoutes");
const wholesalerRoutes = require("./wholesalerRoutes");

// Not adding authorization middleware here as login is not needed
router.use("/retailer", retailerRoutes);
router.use("/wholesaler", wholesalerRoutes);

module.exports = router;
