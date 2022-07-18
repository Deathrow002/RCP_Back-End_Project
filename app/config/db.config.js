module.exports = {
  HOST: "mysqldb",
  USER: "root",
  PASSWORD: "12345678",
  DB: "IBM_RCP_DATABASE",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
