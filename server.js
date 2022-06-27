const express = require("express");

const app = express();

const cors = require("cors");

var corsOptions = {
  origin: "http://localhost:8081",
};

var fileupload = require("express-fileupload");

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(fileupload());

const db = require("./app/models");
const dbConfig = require("./app/config/db.config")

const Role = db.role;

db.mongoose
  .connect(dbConfig.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "Project Manager",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'Project Manager' to roles collection");
      });
      new Role({
        name: "Quality Assurance",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'Quality Assurance' to roles collection");
      });
      new Role({
        name: "Admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'Admin' to roles collection");
      });
    }
  });
}

require('./app/routes/auth.routes')(app);

require('./app/routes/user.routes')(app);

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({ message: "IBM RCP Server is Started" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
