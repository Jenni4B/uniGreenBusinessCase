import dbconn from "../config/dbconn.js";
import { DataTypes } from "sequelize";

const admin = dbconn.define('admin', {})