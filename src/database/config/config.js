require("dotenv").config()

module.exports = {
  development: {
    host: process.env.DB_DEV_HOST,
    username: process.env.DB_DEV_USERNAME,
    password: process.env.DB_DEV_PASSWORD,
    database: process.env.DB_DEV_NAME,
    dialect: process.env.DB_DEV_DIALECT,
    port: process.env.DB_DEV_PORT || 5432,  // Default to 5432 if no port specified
    logging: false,
    pool: {
      max: 100,       // Optimal upper limit without overloading PostgreSQL
      min: 10,        // Maintain a small pool of open connections
      acquire: 30000, // Standard acquire timeout (30 sec)
      idle: 10000,    // Close idle connections after 10 sec
      evict: 5000,    // Regularly clean up unused connections
      validate: async (conn) => {
        try {
          await conn.query("SELECT 1"); // Test if the connection is still active
          return true;
        } catch (error) {
          return false;
        }
      }, // Ensures connections are valid
    }
  },
  staging: {
    host: process.env.DB_STAG_HOST,
    username: process.env.DB_STAG_USERNAME,
    password: process.env.DB_STAG_PASSWORD,
    database: process.env.DB_STAG_NAME,
    dialect: process.env.DB_STAG_DIALECT,
    port: process.env.DB_STAG_PORT || 5432,  // Default to 5432 if no port specified
    logging: false,
    pool: {
      max: 100,
      min: 10,
      acquire: 30000,
      idle: 10000,
      evict: 5000,
      validate: async (conn) => {
        try {
          await conn.query("SELECT 1"); 
          return true;
        } catch (error) {
          return false;
        }
      }
    }
  },
  production: {
    host: process.env.DB_PROD_HOST,
    username: process.env.DB_PROD_USERNAME,
    password: process.env.DB_PROD_PASSWORD,
    database: process.env.DB_PROD_NAME,
    dialect: process.env.DB_PROD_DIALECT,
    port: process.env.DB_PROD_PORT || 5432,  // Default to 5432 if no port specified
    logging: false,
    pool: {
      max: 100,
      min: 10, 
      acquire: 30000,
      idle: 10000,
      evict: 5000,
      validate: async (conn) => {
        try {
          await conn.query("SELECT 1");
          return true;
        } catch (error) {
          return false;
        }
      } 
    }
  }
}
