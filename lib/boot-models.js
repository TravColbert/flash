const fs = require('fs')
const path = require('path')

// Setup ORM
const Sequelize = require('sequelize')

const seedModel = async function (table, seedDefinition) {
  if (Array.isArray(seedDefinition)) {
    seedDefinition.forEach(async (definition) => {
      await table.create(definition)
    })
  } else {
    await table.create(seedDefinition)
  }
}

module.exports = function (options) {
  const verbose = options.verbose
  const modelPath = path.join(__dirname, '..', 'models')
  const modelPaths = fs.readdirSync(modelPath)
  const db = new Sequelize(options.dbConfig)

  verbose && console.log(`Searching subdirectories for model definitions: ${modelPaths}`)
  modelPaths.forEach(async (name) => {
    const modelDir = path.join(modelPath, name)
    verbose && console.log(' %s : %s', name, modelDir)
    const modelDefinition = require(modelDir)(Sequelize)
    await db.define(name, modelDefinition.definition)
    await db.sync()
    if (modelDefinition.association !== undefined) await modelDefinition.association(db)
    if (modelDefinition.seed !== undefined) await seedModel(db.models[name], modelDefinition.seed)
    console.log(db.models)
  })

  return db
}
