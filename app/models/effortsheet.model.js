module.exports = (sequelize, Sequelize) => {
    const effortSheet = sequelize.define("effortsheets", {
      Column_number: {
        type: Sequelize.INTEGER,
      },
      Effort_Data: {
        type: Sequelize.JSON,
      },
      Start_Date: {
        type: Sequelize.STRING,
      },
      End_Date: {
        type: Sequelize.STRING,
      },
      SheetName: {
        type: Sequelize.STRING,
      },
      SUM: {
        type: Sequelize.INTEGER,
      },
      Sheet_ID: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
    });
    return effortSheet;
  };
  