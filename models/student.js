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
    gender: {
        // Male, Female, Other
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash'
    }
  });

  // student.hasMany(Transaction, { foreignKey: 'student_id' });


export default student;