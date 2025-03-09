const retailerServive = require("../services/retailerService");
const { CustomResponse } = require("../utils/helper");

//Get retailers who have a single wholesaler
const getRetailersWithSingleWholesaler = async (req, res) => {
    try {
        // Find retailers that have exactly one wholesaler
        const retailer = await retailerServive.getRetailersWithSingleWholesalers();

        CustomResponse(res, 200, "Here is the retailer with single wholesalers", retailer);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {
    getRetailersWithSingleWholesaler
}