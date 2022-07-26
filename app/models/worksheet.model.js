module.exports = (sequelize, Sequelize) => {
  const Worksheet = sequelize.define("worksheets", {
    Column_number: {
      type: Sequelize.INTEGER,
    },
    Batch: {
      type: Sequelize.STRING,
    },
    UR_Number: {
      type: Sequelize.STRING,
    },
    UR_Desc: {
      type: Sequelize.STRING,
    },
    Start_Date: {
      type: Sequelize.DATEONLY,
    },
    End_Date: {
      type: Sequelize.DATEONLY,
    },
    SUM: {
      type: Sequelize.INTEGER,
    },
    App: {
      type: Sequelize.STRING,
    },
    SheetName: {
      type: Sequelize.STRING,
    },
    Sheet_ID: {
      type: Sequelize.UUID,
      primaryKey: true,
    },
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
  });
  return Worksheet;
};
