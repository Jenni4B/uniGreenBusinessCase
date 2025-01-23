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
    teacher_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    course_description: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

export default course;