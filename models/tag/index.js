const Sequelize = require('sequelize')

module.exports = function (db) {
  return db.define('card', {
    front: Sequelize.TEXT,
    back: Sequelize.TEXT
  })
}
