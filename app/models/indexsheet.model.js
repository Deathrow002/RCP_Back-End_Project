module.exports = (sequelize, Sequelize) => {
  const Indexsheet = sequelize.define("indexsheet", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    SheetName: {
      type: Sequelize.STRING,
    },
    Authorizer: {
      type: Sequelize.STRING,
    },
  });
  return Indexsheet;
};
