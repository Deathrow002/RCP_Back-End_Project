const db = require("../models");

const excelToJson = require("convert-excel-to-json");
const xlsx = require("xlsx");
const fs = require("fs");
var xls = require('excel');

const User = require("../models/user.model");

const Table = db.Project_Table;

exports.UploadSheet = (req, res) => {
  const cell = new Table({
    project_name: req.body.project_name,
    project_owner: req.userId,
    worksheet: null,
  });
  cell.save((err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send("Uplaod Worksheet Successed");
  });
};

exports.ConvertExelToJson = (req, res) => {
  /*const file = (req.files);
  const conFile = excelToJson({
    source: file,
  });
  res.send(conFile);*/
  xls(req.files, function(err, data){
    if(err)throw err;
    res.send(JSON.stringify(convertToJSON(data)))
  })
};

function convertToJSON(array) {
  var first = array[0].join()
  var headers = first.split(',');

  var jsonData = [];
  for ( var i = 1, length = array.length; i < length; i++ )
  {

    var myRow = array[i].join();
    var row = myRow.split(',');

    var data = {};
    for ( var x = 0; x < row.length; x++ )
    {
      data[headers[x]] = row[x];
    }
    jsonData.push(data);

  }
  return jsonData;
};