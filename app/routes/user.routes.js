const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const UploadSheet = require("../JsonConverter/ExceltoJson");
const upload = require("../middlewares/upload")

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/test/all", controller.allAccess);
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  app.post(
    "/api/test/upload_sheet",
    [authJwt.verifyToken],
    upload.single("file"),
    UploadSheet.ConvertExelToJson
  );
  app.get(
    "/api/test/get_sheetsname",
    [authJwt.verifyToken],
    upload.single("file"),
    UploadSheet.GetSheetName
  );
};
