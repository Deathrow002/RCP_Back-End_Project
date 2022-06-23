const mongoose = require("mongoose");
const Project_Table = mongoose.model(
  "Project Table",
  new mongoose.Schema({
    project_name: String,
    project_owner:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    worksheet:[{
      type:Array
    }]
  })
);
module.exports = Project_Table;

