// seeders/YYYYMMDDHHMMSS-demo-data.js
const { faker } = require('@faker-js/faker/locale/en_IN');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Track used phone numbers to ensure uniqueness
    const usedPhoneNumbers = new Set();

    // Generate a unique Indian mobile number
    const generateUniqueIndianMobile = () => {
      // Indian mobile numbers start with 6, 7, 8, or 9 followed by 9 digits
      let mobileNumber;
      do {
        const prefix = faker.helpers.arrayElement(['6', '7', '8', '9']);
        mobileNumber = prefix + faker.string.numeric(9);
      } while (usedPhoneNumbers.has(mobileNumber));

      usedPhoneNumbers.add(mobileNumber);
      return mobileNumber;
    };

    // 1. Create Wholesalers with UUIDs
    const wholesalers = [];
    const wholesalerIds = [];

    for (let i = 0; i < 10; i++) {
      const uuid = uuidv4();
      wholesalerIds.push(uuid);

      wholesalers.push({
        id: uuid,
        name: faker.company.name() + ' Wholesale',
        mobile_number: generateUniqueIndianMobile(),
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('Wholesalers', wholesalers);

    // 2. Create Retailers with UUIDs
    const retailers = [];
    const retailerIds = [];

    for (let i = 0; i < 20; i++) {
      const uuid = uuidv4();
      retailerIds.push(uuid);

      retailers.push({
        id: uuid,
        name: faker.company.name() + ' ' + faker.commerce.department(),
        mobile_number: generateUniqueIndianMobile(),
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('Retailers', retailers);

    // 3. Create Wholesaler-Retailer Relationships
    const wholesalerRetailerRelationships = [];
    const relationshipMap = new Map(); // Track unique relationships

    // Each wholesaler will be associated with 3-6 retailers
    for (const wholesalerId of wholesalerIds) {
      // Get random number of retailers for this wholesaler
      const numRetailers = faker.number.int({ min: 3, max: 6 });

      // Create a set to ensure no duplicate retailers for this wholesaler
      const selectedRetailers = new Set();

      while (selectedRetailers.size < numRetailers && selectedRetailers.size < retailerIds.length) {
        const randomIndex = faker.number.int({ min: 0, max: retailerIds.length - 1 });
        const retailerId = retailerIds[randomIndex];

        // Skip if this relationship already exists
        const relationshipKey = `${wholesalerId}-${retailerId}`;
        if (relationshipMap.has(relationshipKey)) {
          continue;
        }

        selectedRetailers.add(retailerId);
        relationshipMap.set(relationshipKey, true);
      }

      // Add relationships to the array
      for (const retailerId of selectedRetailers) {
        wholesalerRetailerRelationships.push({
          wholesaler_id: wholesalerId,
          retailer_id: retailerId,
        });
      }
    }

    // Ensure at least one retailer has exactly one wholesaler
    if (retailerIds.length > 0) {
      const singleRetailerId = retailerIds[0]; // Picking the first retailer
      const relatedWholesalers = wholesalerRetailerRelationships.filter(rel => rel.retailer_id === singleRetailerId);

      if (relatedWholesalers.length > 1) {
        // Keep only one relationship and remove others
        wholesalerRetailerRelationships.splice(
          wholesalerRetailerRelationships.findIndex(rel => rel.retailer_id === singleRetailerId),
          relatedWholesalers.length - 1
        );
      }
    }

    await queryInterface.bulkInsert('WholesalerRetailers', wholesalerRetailerRelationships);

    // 4. Create Stock Data for 2021
    const stockData = [];

    // Generate monthly stock data for each relationship
    for (const relationship of wholesalerRetailerRelationships) {
      for (let month = 0; month < 12; month++) {
        // Create date for 15th of each month
        const date = new Date(2021, month, 15);

        // Generate a realistic stock amount (in Indian context)
        const stockAmount = faker.number.float({
          min: 10000,
          max: 150000,
          precision: 0.01
        });

        stockData.push({
          id: uuidv4(),
          wholesaler_id: relationship.wholesaler_id,
          retailer_id: relationship.retailer_id,
          stock_amount: stockAmount,
          date: date,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }

    return queryInterface.bulkInsert('Stocks', stockData);
  },

  down: async (queryInterface, Sequelize) => {
    // Delete data in reverse order of creation
    await queryInterface.bulkDelete('Stocks', null, {});
    await queryInterface.bulkDelete('WholesalerRetailers', null, {});
    await queryInterface.bulkDelete('Retailers', null, {});
    await queryInterface.bulkDelete('Wholesalers', null, {});
  }
};