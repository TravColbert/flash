const Sequelize = require('sequelize')

module.exports = function (db) {
  return db.define('tag', {
    name: Sequelize.STRING
  })
}
