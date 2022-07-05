import { useEffect, useState } from "react";
import DataGrid from "react-data-grid";
import { read, utils } from "xlsx";

const url = "https://oss.sheetjs.com/test_files/RkNumber.xls";

export default function App() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  useEffect(() => {(async () => {
    const wb = read(await (await fetch(url)).arrayBuffer(), { WTF: 1 });

    /* use sheet_to_json with header: 1 to generate an array of arrays */
    const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });

    /* see react-data-grid docs to understand the shape of the expected data */
    setColumns(data[0].map((r) => ({ key: r, name: r })));
    setRows(data.slice(1).map((r) => r.reduce((acc, x, i) => {
      acc[data[0][i]] = x;
      return acc;
    }, {})));
  })(); });

  return <DataGrid columns={columns} rows={rows} />;
}