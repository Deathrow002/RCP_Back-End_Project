const db = require("../models");
const ObjectId = require("mongodb").ObjectId;

const excelToJson = require("convert-excel-to-json");
const fs = require("fs");

const User = db.user;
const Table = db.Project_Table;

exports.excelJson = (req, res) => {
  const cell = new Table({
    project_name: req.body.project_name,
    project_owner: req.userId,
    worksheet: req.body.sheet,
  });
  cell.save((err, cell) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (req.userId) {
      User.find(ObjectId(req.userId), (err, uid) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        cell.uid = uid.map((user)=>user._id)
        //res.send("Data: " + cell.uid);
      });
    }
  });
};
