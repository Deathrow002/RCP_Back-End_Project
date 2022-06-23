const db = require("../models");

const excelToJson = require('convert-excel-to-json');
const fs = require('fs');

const Table = db.Project_Table;

exports.excelJson = (req, res) => {
    const cell = new Table({
        project_name:req.body.project_name,

    })
}
