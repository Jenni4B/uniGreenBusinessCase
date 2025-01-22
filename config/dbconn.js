import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(
    // Database name, username, password
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    { 
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    }
);

    // Auth to ensure DB connection

    try {
        await sequelize.authenticate();
        console.log("Connection to database establiashed")
    } catch (error) {
        console.error("Unable to connect to database")
    }


// module.exports = sequelize
export default sequelize;