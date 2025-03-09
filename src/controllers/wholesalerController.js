const wholesalerService = require("../services/wholesalerService");
const { CustomError, CustomResponse } = require("../utils/helper");


// Get wholesaler with associated retailers
const getWholesalerWithRetailers = async (req, res) => {
    try {
        const { wholesaler_id } = req.params;

        const wholesaler = await wholesalerService.wholesalerWithRetailers(wholesaler_id);

        if (!wholesaler) {
            return CustomError(res, 400, "No wholesaler found with the given ID.");
        }

        CustomResponse(res, 200, "Wholesaler details retrieved successfully.", wholesaler);
    } catch (error) {
        console.error(error);
        return CustomError(res, 500, error.message || "Internal Server Error", error);
    }
};

//Total monthly turnover of each wholesaler for a complete year
const getMonthlyTurnover = async (req, res) => {
    try {
        const { year = 2021 } = req.query;

        // Validate input
        if (!year || !Number.isInteger(Number(year))) {
            return CustomError(res, 422, "please provide a valid year value");
        }        

        const turnoverData = await wholesalerService.getMonthlyWholesalersTurnoverByYear(year);

        if (!turnoverData || turnoverData.length < 1) {
            return CustomError(res, 400, "No turnover data found for the given year.",);
        }

        CustomResponse(res, 200, "Monthly turnover of each wholesaler retrieved successfully.", turnoverData);
    } catch (error) {
        console.error(error);
        return CustomError(res, 500, error.message || "Internal Server Error", error);
    }
};

//Max turnover of each wholesaler from a single retailer
const getMaxTurnoverFromRetailer = async (req, res) => {
    try {
        const { year = 2021 } = req.query;

        // Validate input
        if (!year || !Number.isInteger(Number(year))) {
            return CustomError(res, 422, "please provide a valid year value");
        }

        const data = await wholesalerService.getMaxTurnoverFromRetailer(year);

        if (data.length < 1) {
            return CustomError(res, 400, "No data found for the given year");
        }

        CustomResponse(res, 200, "Here is the max turnover of each wholesaler from a single retailer", data)

    } catch (error) {
        console.error(error);
        return CustomError(res, 500, error.message || "Internal Server Error", error);
    }
};


module.exports = {
    getWholesalerWithRetailers, getMonthlyTurnover, getMaxTurnoverFromRetailer
}