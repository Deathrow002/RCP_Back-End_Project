const db = require("../models");
const config = require("../config/auth.config");

const xlsx = require("xlsx");
var fs = require("fs");

const Worksheet = db.Worksheet;
const SheetIndex = db.SheetIndex;
const EffortSheet = db.EffortSheet;

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
  let path = "./uploads/" + req.file.filename;
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }
    const file = xlsx.readFile(path, { type: "binary", cellDates: true });

    //const SelectedSheet = "AD_2-Payment";

    const SelectedSheet = "AD_1A-Finance";

    const ws = file.Sheets[SelectedSheet];

    var range = xlsx.utils.decode_range(ws["!ref"]);

    range.s.r = 1; // <-- zero-indexed, so setting to 1 will skip row 0

    ws["!ref"] = xlsx.utils.encode_range(range);

    const tempData = xlsx.utils.sheet_to_json(ws, { raw: false });

    // upload sheet-index
    try {
      // upload sheet-index
      const indexSheet = await SheetIndex.create({
        SheetName: SelectedSheet,
        Authorizer: req.userId,
      });

      var sheetId = indexSheet.id;

      // Reform Data
      const sheetData = worksheetData(tempData, SelectedSheet, sheetId);

      // upload worksheet
      Worksheet.bulkCreate(sheetData).then((data) => {
        // Create Effort Sheet
        EffortSheet.bulkCreate(splitEffort(data));
      });
    } catch (error) {
      res.status(500).send({
        message: "Fail to import data into database!",
        error: error.message,
      });
    }

    fs.unlinkSync(path);
    res.status(200).send({
      message: "Data Converted Success",
      SheetName: SelectedSheet,
      //ShowData: tempData,
      //Data: Sheet_ID,
    });
  } catch (error) {
    fs.unlinkSync(path);
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

function worksheetData(data, SheetName, Sheet_ID) {
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
      if (data[val] == null || data[val] == " ") {
        ["IBM\r\nActual Start \r\nDate"].forEach((val) => {
          if (data[val] == null || data[val] == " ") {
            data["Start_Date"] = null;
          } else {
            data["Start_Date"] = data[val];
          }
        });
      } else {
        data["Start_Date"] = data[val];
      }
    });
    ["Target Implementation"].forEach((val) => {
      if (data[val] == null || data[val] == " ") {
        ["Project IMP Year-Month"].forEach((val) => {
          if (data[val] == null || data[val] == " ") {
            data["End_Date"] = null;
          } else {
            if (data[val] == "9999") {
              data["End_Date"] = null;
            } else {
              let dates = data[val].match(/.{1,4}/g);
              if (dates[1] == "x") {
                data["End_Date"] = null;
              } else {
                data["End_Date"] = "28-" + dates[1] + "-" + dates[0];
              }
            }
          }
        });
      } else {
        data["End_Date"] = data[val];
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

function splitEffort(data) {
  let tempData = [];
  let newData = [];
  let Data = [];

  tempData = data.map((data) => {
    return data;
  });

  tempData.forEach((row) => {
    let effortData = [];
    var Ys, Ye, Ms, Me;

    if (row["End_Date"] != null && row["Start_Date"] != null) {
      var Start = row["Start_Date"].split("-");
      var End = row["End_Date"].split("-");
      Ys = parseInt(Start[0]);
      Ye = parseInt(End[0]);
      Ms = parseInt(Start[1]);
      Me = parseInt(End[1]);
      var Year = Ye - Ys;
      var Month = Me - Ms;
      var sum = row["SUM"];
      if (Year == 0) {
        if (Month > 0) {
          effortData = CreateEffotCell(Month, sum).map((data) => {
            var Data = JSON.stringify(data);
            return Data;
          });
        }
      } else {
        var duration = Me + 12 - Ms;
        if (Month != 0) {
          effortData = CreateEffotCell(duration, sum).map((data) => {
            var Data = JSON.stringify(data);
            return Data;
          });
        }
      }
    }

    newData.push([
      row["Column_number"],
      effortData,
      row["Start_Date"],
      row["End_Date"],
      row["SUM"],
      row["SheetName"],
      row["Sheet_ID"],
      row["id"],
    ]);
  });

  newData.forEach((row) => {
    let data = {
      Column_number: row[0],
      Effort_Data: row[1],
      Start_Date: row[2],
      End_Date: row[3],
      SUM: row[4],
      SheetName: row[5],
      Sheet_ID: row[6],
      id: row[7],
    };
    Data.push(data);
  });

  return Data;
}

function CreateEffotCell(M, S) {
  let Data = [];
  var data;
  var Quarter = M * 4;
  if (S != null) {
    if (M > 6) {
      Quarter = 6 * 4 + 2;
    }

    var Sum = S / Quarter;

    Sum = Sum * 10000;
    Sum = parseInt(Sum);
    Sum = Sum / 10000;

    for (let i = 0; i < Quarter; i++) {
      data = { [`Week ${i + 1}`]: Sum };
      Data.push(data);
    }
  }
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
