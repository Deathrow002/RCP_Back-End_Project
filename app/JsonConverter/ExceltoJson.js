const db = require("../models");

const xlsx = require("xlsx");
var fs = require("fs");

//var multer = require("multer");

//var upload = multer({ dest: "./uploads/" });

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

exports.ConvertExelToJson = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path = "./uploads/" + req.file.filename;

    const file = xlsx.readFile(path);

    const sheetNames = file.SheetNames;
    const totalSheets = sheetNames.length;

    let parsedData = [];
    let allsheet = [];

    const Choose_Sheet = ["AD_2-Payment", "AD_1A-Finance"];

    let chooseSheet = Choose_Sheet.length;

    var count = 0;

    /*for (let i = 0; i < totalSheets; i++) {
      const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[i]]);
      tempData.shift();
      parsedData.push(...tempData);
      allsheet.push(sheetNames[i]);
    }*/

    for (let i = 0; i < totalSheets; i++) {
      for (let j = 0; j < chooseSheet; j++) {
        if (sheetNames[i] == Choose_Sheet[j]) {
          res.write(
            "Sheet Match: " + Choose_Sheet[j] + " and " + sheetNames[i]
          );
          const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[i]]);
          generateJSONFile(tempData, sheetNames[j]);
        }
      }
    }

    //generateJSONFile(parsedData, path, req.file.filename);
    res.status(200);
    res.write("Data was Created");
    res.send();

    fs.unlinkSync(path);
  } catch (error) {
    console.log(error);
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
