const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.Worksheet = require("../models/worksheet.model")(sequelize, Sequelize);
db.EffortSheet = require("../models/effortsheet.model")(sequelize, Sequelize);
db.SheetIndex = require("../models/indexsheet.model")(sequelize, Sequelize);

// user_roles
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

// user_sheetindex
db.SheetIndex.belongsToMany(db.user,{
  through: "user_sheetindex",
  foreignKey: "SHId",
  otherKey: "userId",
})
db.user.belongsToMany(db.SheetIndex,{
  through: "user_sheetindex",
  foreignKey: "userId",
  otherKey: "SHId",
})

db.ROLES = ["user", "admin", "moderator"];
module.exports = db;
