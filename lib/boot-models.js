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
  await db.sync()
}

const buildAssociations = async function (db, modelName, modelDefinition) {
  if (modelDefinition.association !== undefined) {
    console.log(' model - %s:\tbuilding associations', modelName)
    await modelDefinition.association(db)
    await db.sync()
  }
}

const buildSeeds = async function (db, modelName, modelDefinition) {
  if (modelDefinition.seed !== undefined) {
    console.log(' model - %s:\tbuilding seeds', modelName)
    await seedModel(db.models[modelName], modelDefinition.seed)
    await db.sync()
  }
}

module.exports = function (options) {
  const verbose = options.verbose
  const modelPath = path.join(__dirname, '..', 'models')
  const modelFileNames = fs.readdirSync(modelPath)
  console.log(modelFileNames)
  const db = new Sequelize(options.dbConfig)

  const iterateModelPaths = async function (db, modelFileNames, func) {
    for (const modelFileName of modelFileNames) {
      const modelFile = path.join(modelPath, modelFileName)
      // const modelFile = path.join(modelDir, 'index.js')
      verbose && console.log(' model - %s:\t%s', modelFileName, modelFile)
      // const tableName = inflection.pluralize(name)
      const modelDefinition = require(modelFile)(Sequelize, db)
      let modelName
      if (modelDefinition.name !== undefined) {
        modelName = modelDefinition.name
      } else if (modelDefinition.options?.modelName !== undefined) {
        modelName = modelDefinition.options?.modelName
      } else {
        modelName = inflection.singularize(path.basename(modelFileName, '.js').split('.')[1])
      }

      verbose && console.log(' model - %s:\tsetting model name to: %s', modelFileName, modelName)

      await func(db, modelName, modelDefinition)
    }
    return db
  }

  // verbose && console.log(`Searching subdirectories for model definitions: ${modelPathNames}`)

  iterateModelPaths(db, modelFileNames, buildModel)
    .then(async (db) => {
      return await iterateModelPaths(db, modelFileNames, buildAssociations)
    })
    .then(async (db) => {
      await iterateModelPaths(db, modelFileNames, buildSeeds)
    })

  // modelNames.forEach(async (name) => {
  //   const modelDir = path.join(modelPath, name)
  //   const modelModule = path.join(modelDir, 'index.js')
  //   verbose && console.log(' %s:\t%s', name, modelDir)

  //   try {
  //     fs.accessSync(modelModule, fs.constants.R_OK)
  //     console.log(`\t${modelModule} exists...`)
  //     // const tableName = inflection.pluralize(name)
  //     const modelName = inflection.singularize(name)
  //     const modelDefinition = require(modelDir)(Sequelize)
  //   } catch {
  //     console.log(`\t${modelModule} does not exist`)
  //   }
  // })

  // modelNames.forEach(async (name) => {
  //   const modelDir = path.join(modelPath, name)
  //   const modelModule = path.join(modelDir, 'index.js')
  //   verbose && console.log(' %s:\t%s', name, modelDir)

  //   try {
  //     fs.accessSync(modelModule, fs.constants.R_OK)
  //     console.log(`\t${modelModule} exists...`)
  //     // const modelName = inflection.singularize(name)
  //     const modelDefinition = require(modelDir)(Sequelize)
  //     if (modelDefinition.association !== undefined) {
  //       await modelDefinition.association(db)
  //       await db.sync()
  //     }
  //   } catch {
  //     console.log(`\t${modelModule} does not exist`)
  //   }
  // })

  // modelNames.forEach(async (name) => {
  //   const modelDir = path.join(modelPath, name)
  //   const modelModule = path.join(modelDir, 'index.js')
  //   verbose && console.log(' %s:\t%s', name, modelDir)

  //   try {
  //     fs.accessSync(modelModule, fs.constants.R_OK)
  //     console.log(`\t${modelModule} exists...`)
  //     // const modelName = inflection.singularize(name)
  //     const modelDefinition = require(modelDir)(Sequelize)
  //     if (modelDefinition.seed !== undefined) {
  //       await seedModel(db.models[name], modelDefinition.seed)
  //       await db.sync()
  //     }
  //   } catch {
  //     console.log(`\t${modelModule} does not exist`)
  //   }
  // })

  return db
}
