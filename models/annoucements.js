import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Import your Sequelize connection

const Announcement = sequelize.define('Announcement', {
    annnouncement_id: {
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
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'admins', // The name of the referenced table
            key: 'admin_id' // The primary key of the referenced table
        }
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
});

export default Announcement;
