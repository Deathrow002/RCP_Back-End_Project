const db = require("../models");

const xlsx = require("xlsx");
var fs = require("fs");
const { json } = require("express");

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

exports.GetSheetName = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path = "./uploads/" + req.file.filename;

    const file = xlsx.readFile(path, { type: "binary", dateNF: "mm/dd/yyyy" });

    const sheetname = file.SheetNames;

    res.status(200).send({
      data: JSON.stringify(sheetname),
    })
  } catch (error) {
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

exports.ConvertExelToJson = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path = "./uploads/" + req.file.filename;

    const file = xlsx.readFile(path, { type: "binary", dateNF: "mm/dd/yyyy" });

    const Choose_Sheet = "AD_1A-Finance";

    const tempData = xlsx.utils.sheet_to_json(file.Sheets[Choose_Sheet]);

    generateJSONFile(tempData, Date.now() + "." + Choose_Sheet);

    fs.unlinkSync(path);
    res.status(200).send({ message: "Data was Created"});
  } catch (error) {
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

function generateJSONFile(data, filename) {
  try {
    fs.writeFileSync(
      "./uploads/output/" + filename + ".data.json",
      JSON.stringify(data)
    );
  } catch (err) {
    console.error(err);
  }
}
