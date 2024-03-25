const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        
        role_id: {
            type: DataTypes.STRING,
            defaultValue: "1",
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        idNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        hooks: {
            beforeCreate: async (user) => {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }); 
};
