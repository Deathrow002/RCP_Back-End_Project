const db = require("../models");

const xlsx = require("xlsx");
var fs = require("fs");

const Table = db.Project_Table;

exports.UploadSheet = (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }
    let path = "./uploads/" + req.file.filename;

    const file = xlsx.readFile(path);

    const sheetNames = file.SheetNames;
    const totalSheets = sheetNames.length;

    const Choose_Sheet = ["AD_2-Payment"];

    //let chooseSheet = Choose_Sheet.length;

    const sheetData = '';

    const sheet = new Table({
      project_name: req.body.project_name,
      project_owner: req.userId,
      worksheet: sheetData
    });

    /*for (let i = 0; i < totalSheets; i++) {
      for (let j = 0; j < chooseSheet; j++) {
        if (sheetNames[i] == Choose_Sheet[j]) {
          
          generateJSONFile(tempData, Date.now() + "." + sheetNames[i]);
        }
      }
    }*/

    sheetData = xlsx.utils.sheet_to_json(file.Sheets[Choose_Sheet]);

    sheet.save((err, sheet) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send("Uplaod Worksheet Successed");
    });
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

    const file = xlsx.readFile(path);

    const sheetNames = file.SheetNames;
    const totalSheets = sheetNames.length;

    const Choose_Sheet = ["AD_2-Payment", "AD_1A-Finance"];

    let chooseSheet = Choose_Sheet.length;

    for (let i = 0; i < totalSheets; i++) {
      for (let j = 0; j < chooseSheet; j++) {
        if (sheetNames[i] == Choose_Sheet[j]) {
          const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[i]]);
          generateJSONFile(tempData, Date.now() + "." + sheetNames[i]);
        }
      }
    }

    fs.unlinkSync(path);
    res.status(200);
    res.write("Data was Created");
    res.send();
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
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
}
