const { Op } = require("sequelize");
const { Wholesaler, Retailer, Stock, sequelize } = require("../models/index");

const wholesalerWithRetailers = async (wholesaler_id) => {
    return await Wholesaler.findByPk(wholesaler_id, {
        include: [
            {
                model: Retailer,
                as: "retailers",
                through: { attributes: [] }, // Exclude join table attributes
                required:false
            }
        ]
    });
}

const getMonthlyWholesalersTurnoverByYear = async (year) => {
    // Validate input
    if (!year || !Number.isInteger(Number(year))) {
        throw new Error('Invalid year parameter');
    }
    
    // First query to get aggregated data without joins
    const turnoverData = await Stock.findAll({
        attributes: [
            'wholesaler_id',
            [sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date"')), 'month'],
            [sequelize.fn('SUM', sequelize.col('stock_amount')), 'total_turnover']
        ],
        where: sequelize.where(
            sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "date"')), 
            year
        ),
        group: ['wholesaler_id', sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date"'))],
        order: [
            ['wholesaler_id', 'ASC'],
            [sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date"')), 'ASC']
        ],
        raw: true // Get raw results for this query
    });

    // If no data found, return empty array
    if (!turnoverData || turnoverData.length === 0) {
        return [];
    }

    // Get all unique wholesaler IDs from the results
    const wholesalerIds = [...new Set(turnoverData.map(item => item.wholesaler_id))];
    
    // Fetch wholesaler details in a separate query
    const wholesalers = await Wholesaler.findAll({
        where: {
            id: wholesalerIds
        },
        attributes: ['id', 'name'],
        raw: true
    });
    
    // Create a map of wholesaler_id to wholesaler name for quick lookups
    const wholesalerMap = new Map();
    wholesalers.forEach(w => wholesalerMap.set(w.id, w.name));
    
    // Process and structure the final result
    const resultMap = new Map();
    
    turnoverData.forEach(item => {
        const wholesalerId = item.wholesaler_id;
        const month = parseInt(item.month);
        const turnover = parseFloat(item.total_turnover);
        const wholesalerName = wholesalerMap.get(wholesalerId);
        
        if (!resultMap.has(wholesalerId)) {
            resultMap.set(wholesalerId, {
                id: wholesalerId,
                name: wholesalerName,
                monthly_turnover: {}
            });
        }
        
        resultMap.get(wholesalerId).monthly_turnover[month] = turnover;
    });
    
    return Array.from(resultMap.values());
};

const getMaxTurnoverFromRetailer = async (year) => {
    const turnoverByRetailer = await Stock.findAll({
        attributes: [
            'wholesaler_id',
            'retailer_id',
            [sequelize.fn('SUM', sequelize.col('stock_amount')), 'total_turnover']
        ],
        where: sequelize.where(
            sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "date"')),
            year
        ),
        group: [
            'Stock.wholesaler_id', 
            'Stock.retailer_id', 
            'wholesaler.id', 
            'wholesaler.name', 
            'retailer.id', 
            'retailer.name'
        ],
        include: [
            {
                model: Wholesaler,
                as: 'wholesaler',
                attributes: ['id', 'name'],
                required: true
            },
            {
                model: Retailer,
                as: 'retailer',
                attributes: ['id', 'name'],
                required: true
            }
        ],
        raw: false
    });

    if (!turnoverByRetailer || turnoverByRetailer.length === 0) {
        return [];
    }

    const wholesalersMap = new Map();

    turnoverByRetailer.forEach(item => {
        const wholesalerId = item.wholesaler_id;
        const turnover = parseFloat(item.getDataValue('total_turnover'));
        
        if (!wholesalersMap.has(wholesalerId) || wholesalersMap.get(wholesalerId).max_turnover < turnover) {
            wholesalersMap.set(wholesalerId, {
                id: wholesalerId,
                name: item.wholesaler.name,
                max_turnover: turnover,
                max_turnover_retailer: {
                    id: item.retailer_id,
                    name: item.retailer.name
                }
            });
        }
    });

    return Array.from(wholesalersMap.values());
};


module.exports = {
    wholesalerWithRetailers, getMonthlyWholesalersTurnoverByYear, getMaxTurnoverFromRetailer
}