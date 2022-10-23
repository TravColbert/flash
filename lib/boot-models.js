const fs = require('fs')
const path = require('path')

// Setup ORM
const Sequelize = require('sequelize')

module.exports = function (options) {
  const verbose = options.verbose
  const modelPath = path.join(__dirname, '..', 'models')
  const modelPaths = fs.readdirSync(modelPath)
  const db = new Sequelize(options.dbConfig)

  verbose && console.log(`Searching subdirectories for model definitions: ${modelPaths}`)
  modelPaths.forEach(function (name) {
    const modelDir = path.join(modelPath, name)
    verbose && console.log(' %s : %s', name, modelDir)
    require(modelDir)(Sequelize, db, name)
  })

  return db
}
