import dbconn from "../config/dbconn.js";
import { DataTypes } from "sequelize";

const course = dbconn.define('course', {
    course_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    course_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    faculty_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'faculty', // The name of the referenced table
            key: 'faculty_id' // The primary key of the referenced table
        }
    },
    course_description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

export default course;
