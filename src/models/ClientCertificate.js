const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("ClientCertificate", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        certificate: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    }); 
};
