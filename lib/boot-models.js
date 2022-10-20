const fs = require("fs");
const path = require("path");

// Setup ORM
const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  // The `host` parameter is required for other databases
  // host: 'localhost'
  dialect: "sqlite",
  storage: "db/database.sqlite",
});

// Test connectivity
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = function (parent, options) {
  var dir = path.join(__dirname, "..", "models");
  var verbose = options.verbose;
  fs.readdirSync(dir).forEach(function (name) {
    var file = path.join(dir, name);
    console.log(" %s : %s", name, file);
    let model = require(file)(sequelize);
    model
      .sync()
      .then(() => {
        console.log(`model-${name} created`);
      })
      .then(() => {
        parent.set(`model-${name}`, model);
      });
  });
};
