import dbconn from "../config/dbconn.js";
import { DataTypes } from "sequelize";

const student = dbconn.define('student', {
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date_of_birth:{
      type: DataTypes.DATE,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'), // ENUM definition
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    pwd_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  // student.hasMany(Transaction, { foreignKey: 'student_id' });


export default student;
