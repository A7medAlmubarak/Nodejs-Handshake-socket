const { Sequelize, DataTypes, Op } = require("sequelize");
require('dotenv').config();


const sequelize = new Sequelize({
  dialect: process.env.DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false
});

const connection = { sequelize, Op, DataTypes,};

const Model ={};
Model.User = require('../models/User')(sequelize, DataTypes);
Model.ClientCertificate = require('../models/ClientCertificate')(sequelize, DataTypes);
Model.Subject = require('../models/Subject')(sequelize, DataTypes);

Model.User.hasMany(Model.Subject);
Model.User.hasMany(Model.ClientCertificate);


/*

Model.Chat = require("../models/Chat")(sequelize, DataTypes);
Model.Message = require("../models/Message")(sequelize, DataTypes);



Model.User.belongsToMany(Model.Chat, { through: 'UserChat' });
Model.Chat.belongsToMany(Model.User, { through: 'UserChat' });

Model.Message.belongsTo(Model.User, {foreignKey: "UserId",as: "user",});
Model.Message.belongsTo(Model.Chat, {foreignKey: "ChatId",as: "chat",});
Model.Chat.hasMany(Model.Message, { as: 'messages' });*/


module.exports = { Model,connection };