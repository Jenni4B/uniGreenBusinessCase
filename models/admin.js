import dbconn from "../config/dbconn.js";
import { DataTypes } from "sequelize";

const admin = dbconn.define('admin', {
    admin_id: {
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
      },
      two_stepHash: {
        type: DataTypes.STRING,
        allowNull: false,
      }
})

export default admin;