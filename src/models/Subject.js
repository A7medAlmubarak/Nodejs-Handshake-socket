const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Subject", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        mark: {
            type: DataTypes.INTEGER, // Assuming mark is an integer; adjust as needed
            defaultValue: null,
          },
        
    }); 
};
