const { Retailer, Wholesaler, sequelize } = require("../models/index");


const getRetailersWithSingleWholesalers = async () => {
    // Find one retailer who has exactly one wholesaler relationship
    const retailer = await Retailer.findOne({
        attributes: [
            'id',
            'name',
            [
                sequelize.literal(
                    '(SELECT COUNT(*) FROM "WholesalerRetailers" WHERE "WholesalerRetailers"."retailer_id" = "Retailer"."id")'
                ),
                'wholesalerCount'
            ]
        ],
        include: [
            {
                model: Wholesaler,
                as: 'wholesalers',
                attributes: ['id', 'name'],
                through: { attributes: [] } // Exclude junction table attributes
            }
        ],
        having: sequelize.literal(
            '(SELECT COUNT(*) FROM "WholesalerRetailers" WHERE "WholesalerRetailers"."retailer_id" = "Retailer"."id") = 1'
        ),
        group: ['Retailer.id', 'wholesalers.id'], // Ensure correct grouping
        subQuery: false
    });
    
    return retailer;
}

module.exports = {
    getRetailersWithSingleWholesalers
}