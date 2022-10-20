const Sequelize = require("sequelize");

module.exports = function (sequelize) {
  return sequelize.define("cards", {
    front: Sequelize.TEXT,
    back: Sequelize.TEXT,
  });
};
