# Express.js Sales-Admin Panel

## Overview

This project is a Sales-Admin Panel built using Express.js, Sequelize, and PostgreSQL. It follows the MVC architecture pattern, separating controllers, services, and routes for better maintainability. The application manages wholesalers, retailers, and stock transactions.

### Key Features:

- **Wholesaler & Retailer Management**: A wholesaler can have multiple retailers, and a retailer can be associated with multiple wholesalers.
- **Stock Transactions**: Wholesalers sell stock to retailers on a monthly basis.
- **Data Prepopulation**: Stock transaction data from January 2021 to December 2021.
- **Comprehensive APIs**:
  1. Retrieve wholesaler details along with associated retailers.
  2. Get a retailer who has a single wholesaler.
  3. Calculate total monthly turnover for each wholesaler over a year.
  4. Find the maximum turnover of each wholesaler from a single retailer.

Follow the steps below to set up and run the project.

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v20.10.0)
- [PostgreSQL](https://www.postgresql.org/)
- [Sequelize-CLI](https://sequelize.org/master/manual/migrations.html)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/vaibhavjst4uu/Sales-Admin-Panel.git
   cd Sales-Admin-Panel
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:
   - Rename `.env.dummy` to `.env`.
   - Update database credentials and other configurations accordingly.

## Database Setup

Run the following Sequelize-CLI commands:

1. Create the database:
   ```sh
   npx sequelize-cli db:create
   ```
2. Run migrations:
   ```sh
   npx sequelize-cli db:migrate
   ```
3. Seed initial data:
   ```sh
   npx sequelize-cli db:seed:all
   ```

## Running the Application

Start the server with:

```sh
nodemon app.js  # For development (if nodemon is installed)
# OR
node app.js     # For production
```

## Environment Variables

Modify the `.env` file with your database credentials:

```
DB_DEV_HOST=<your_database_host>
DB_DEV_USERNAME=<your_database_username>
DB_DEV_PASSWORD=<your_database_password>
DB_DEV_NAME=<your_database_name>

```

## Project Structure

```
├── src/
│   ├── controllers/     # Controllers for handling requests
│   │   ├── retailerController.js
│   │   ├── wholesalerController.js
│   ├── database/
│   │   ├── config/      # Configuration files (Sequelize, environment, etc.)
│   │   ├── migrations/  # Database migrations
│   │   ├── seeders/     # Initial database seeders
│   ├── middlewares/     # Custom middlewares
│   ├── models/          # Sequelize models
│   ├── routes/          # Application routes
│   ├── services/        # Business logic layer
│   ├── utils/           # Utility functions
├── .env.dummy           # Example environment variables file
├── .gitignore           # Git ignore file
├── .sequelizerc         # Sequelize configuration
├── app.js               # Main application entry point
├── package.json         # Dependencies and scripts
├── package-lock.json    # Lock file for dependencies
```

## API Endpoints

1. **Get Wholesaler and Associated Retailers**
   ```sh
   GET /api/v1/wholesalers/:wholesaler_id/retailers
   ```
2. **Get Retailer with a Single Wholesaler**
   ```sh
   GET /api/v1/retailers/single-wholesaler
   ```
3. **Get Total Monthly Turnover of Wholesalers**
   ```sh
   GET /api/v1/wholesalers/monthly-turnover?year=2021
   ```
4. **Get Maximum Turnover from a Single Retailer**
   ```sh
   GET /api/v1/wholesalers/max-turnover?year=2021
   ```

## Additional Notes

- Ensure PostgreSQL service is running before executing Sequelize commands.
- Use `.gitignore` to prevent sensitive files like `.env` from being committed.
- Update the `README.md` as needed to match any project-specific configurations.

