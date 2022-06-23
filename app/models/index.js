const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.Project_Table = require("./table.model")
db.ROLES = ["Project Manager", "Admin", "Quality Assurance"];

module.exports = db;
