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
    tableName: 'announcements',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true 
    // Could not for the life of me figure out why it wouldn't just query what I had but I guess createdAt and updatedAt
    // is an automatic thing I can't control so I'll just do this instead of changing the MySQL DB 😭
});

export default Announcement;
