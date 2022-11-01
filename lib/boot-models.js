const fs = require('fs')
const path = require('path')
const inflection = require('inflection')

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

const buildModel = async function (db, modelName, modelDefinition) {
  console.log(' model - %s:\tbuilding model', modelName)
  await db.define(modelName, modelDefinition.definition)
}

const buildAssociations = async function (db, modelName, modelDefinition) {
  if (modelDefinition.association === undefined) return
  console.log(' model - %s:\tbuilding associations', modelName)
  await modelDefinition.association(db)
  await db.sync()
}

const buildSeeds = async function (db, modelName, modelDefinition) {
  if (modelDefinition.seed === undefined) return
  console.log(' model - %s:\tbuilding seeds', modelName)
  await seedModel(db.models[modelName], modelDefinition.seed)
}

module.exports = function (options) {
  const verbose = options.verbose
  const modelPath = path.join(__dirname, '..', 'models')
  const modelFileNames = fs.readdirSync(modelPath)
  console.log(modelFileNames)
  const db = new Sequelize(options.dbConfig)
  const modelDefinitions = []

  for (const modelFileName of modelFileNames) {
    const modelFile = path.join(modelPath, modelFileName)
    verbose && console.log(' model - %s:\t%s', modelFileName, modelFile)

    const modelDefinition = require(modelFile)(Sequelize, db)
    if (modelDefinition.name === undefined) {
      modelDefinition.name = path.basename(modelFile, '.js')
    }
    modelDefinitions.push(modelDefinition)
  }

  modelDefinitions.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return (a - b)
    } else if (a.order === undefined && b.order === undefined) {
      return 0
    } else if (a.order === undefined) {
      return 1
    } else {
      return -1
    }
  })

  console.log(modelDefinitions)

  const iterateModelDefinitions = async function (db, modelDefinitions, func) {
    for (const modelDefinition of modelDefinitions) {
      console.log(modelDefinition)
      await func(db, modelDefinition.name, modelDefinition)
    }
    return db
  }

  iterateModelDefinitions(db, modelDefinitions, buildModel)
    .then(async (db) => {
      return await iterateModelDefinitions(db, modelDefinitions, buildAssociations)
    })
    .then(async (db) => {
      await iterateModelDefinitions(db, modelDefinitions, buildSeeds)
    })
  return db
}
