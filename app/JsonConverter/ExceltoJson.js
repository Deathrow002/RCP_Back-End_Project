const db = require("../models");
const config = require("../config/auth.config");

const xlsx = require("xlsx");
var fs = require("fs");

const Worksheet = db.Worksheet;
const SheetIndex = db.SheetIndex;

exports.GetSheetName = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path = "./uploads/" + req.file.filename;

    const file = xlsx.readFile(path, { type: "binary", cellDates: true });

    const sheetname = file.SheetNames;

    fs.unlinkSync(path);
    res.status(200).send({
      data: JSON.stringify(sheetname),
    });
  } catch (error) {
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

exports.UploadSheet = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path = "./uploads/" + req.file.filename;

    const file = xlsx.readFile(path, { type: "binary", cellDates: true });

    const Choose_Sheet = "AD_2-Payment";

    //const tempData = xlsx.utils.sheet_to_json(file.Sheets[Choose_Sheet]);

    const ws = file.Sheets[Choose_Sheet];

    var range = xlsx.utils.decode_range(ws["!ref"]);

    range.s.r = 1; // <-- zero-indexed, so setting to 1 will skip row 0

    ws["!ref"] = xlsx.utils.encode_range(range);

    const tempData = xlsx.utils.sheet_to_json(ws, { raw: false });

    // upload sheet-index
    SheetIndex.create({
      SheetName: Choose_Sheet,
      Authorizer: req.userId,
    }).then((data) => {
      const Data = polishData(tempData, Choose_Sheet, data.id);

      // upload worksheet
      try {
        Worksheet.bulkCreate(Data);
      } catch (error) {
        res.status(500).send({
          message: "Fail to import data into database!",
          error: error.message,
        });
      }
    });

    //const data = polishData(tempData, Choose_Sheet, 0000);

    generateJSONFile(tempData, Date.now() + ".polishData." + Choose_Sheet);

    fs.unlinkSync(path);
    res.status(200).send({
      message: "Data Converted Success",
      SheetName: Choose_Sheet,
      //ShowData: tempData,
      //Data: Sheet_ID,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

function polishData(data, SheetName, Sheet_ID) {
  let tempData = [];
  let newData = [];
  let Data = [];

  tempData = data.map((data) => {
    ["ID"].forEach((val) => {
      data["No"] = data[val];
      data["No"] = parseInt(data["No"]);
    });
    ["Batch"].forEach((val) => {
      data["Batch"] = data[val];
    });
    ["Request ID/EPIC"].forEach((val) => {
      data["UR_Number"] = data[val];
    });
    ["Request Name"].forEach((val) => {
      data["UR_Desc"] = data[val];
    });
    ["IBM Plan Start Date "].forEach((val) => {
      data["Start_Date"] = data[val] || "";
      if (data["Start_Date"] == "") {
        ["IBM\r\nActual Start \r\nDate"].forEach((val) => {
          data["Start_Date"] = data[val] || "";
        });
      }
    });
    ["Target Implementation"].forEach((val) => {
      data["End_Date"] = data[val] || "";
      if (data["End_Date"] == "") {
        ["Project IMP Year-Month"].forEach((val) => {
          data["End_Date"] = data[val] || "";
          data["End_Date"].match(/.{1,2}/g);
        });
      }
    });
    ["IBM \r\nEffort Est (MDs)"].forEach((val) => {
      data["SUM"] = data[val];
      data["SUM"] = parseFloat(data["SUM"]);
      if (isNaN(data["SUM"])) data["SUM"] = null;
    });
    ["IBM MS App Name"].forEach((val) => {
      data["App"] = data[val];
    });
    return data;
  });

  tempData.forEach((row) => {
    newData.push([
      row["No"],
      row["Batch"],
      row["UR_Number"],
      row["UR_Desc"],
      row["Start_Date"],
      row["End_Date"],
      row["SUM"],
      row["App"],
      SheetName,
      Sheet_ID,
    ]);
  });

  newData.forEach((row) => {
    let data = {
      Column_number: row[0],
      Batch: row[1],
      UR_Number: row[2],
      UR_Desc: row[3],
      Start_Date: row[4],
      End_Date: row[5],
      SUM: row[6],
      App: row[7],
      SheetName: row[8],
      Sheet_ID: row[9],
    };
    Data.push(data);
  });

  return Data;
}

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
