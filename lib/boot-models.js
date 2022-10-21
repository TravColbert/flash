const fs = require("fs");
const path = require("path");

// Setup ORM
const Sequelize = require("sequelize");

buildModel = async function (db, modelDir) {
  model = require(modelDir)(db);
  await model.sync();
};

module.exports = async function (options) {
  const verbose = options.verbose;
  const modelPath = path.join(__dirname, "..", "models");
  const promises = [];
  const db = new Sequelize({
    // The `host` parameter is required for other databases
    // host: 'localhost'
    dialect: "sqlite",
    storage: "db/database.sqlite",
  });

  modelPaths = fs.readdirSync(modelPath);
  console.log(`Searching subdirectories for model definitions: ${modelPaths}`);
  modelPaths.forEach(function (name) {
    const modelDir = path.join(modelPath, name);
    verbose && console.log(" %s : %s", name, modelDir);
    promises.push(buildModel(db, modelDir));
  });
  await Promise.all(promises).then(() => {
    console.log("built all models");
    return db;
  });
};
