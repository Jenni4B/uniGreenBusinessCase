import { DataTypes } from 'sequelize';
import sequelize from '../config/dbconn.js'; // Import your Sequelize connection

const Announcement = sequelize.define('Announcement', {
    announcement_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false, // Message is required
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
});

export default Announcement;
