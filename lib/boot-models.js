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
  console.log(`\tbuilding model: ${modelName}`)
  await db.define(modelName, modelDefinition.definition)
  await db.sync()
}

const buildAssociations = async function (db, modelName, modelDefinition) {
  if (modelDefinition.association !== undefined) {
    console.log(`\tbuilding associations for model: ${modelName}`)
    await modelDefinition.association(db)
    await db.sync()
  }
}

const buildSeeds = async function (db, modelName, modelDefinition) {
  if (modelDefinition.seed !== undefined) {
    console.log(`\tbuilding seeds for model: ${modelName}`)
    await seedModel(db.models[modelName], modelDefinition.seed)
    await db.sync()
  }
}

module.exports = function (options) {
  const verbose = options.verbose
  const modelPath = path.join(__dirname, '..', 'models')
  const modelPathNames = fs.readdirSync(modelPath)
  const db = new Sequelize(options.dbConfig)

  const iterateModelPaths = async function (db, modelPathNames, func) {
    for (const modelPathName of modelPathNames) {
      const modelDir = path.join(modelPath, modelPathName)
      const modelModule = path.join(modelDir, 'index.js')
      verbose && console.log(' %s:\t%s', modelPathName, modelDir)
      try {
        fs.accessSync(modelModule, fs.constants.R_OK)
        console.log(`\t${modelModule} exists`)
      } catch {
        console.log(`\tcould not read model definition: ${modelModule}`)
        continue
      }
      // const tableName = inflection.pluralize(name)
      const modelName = inflection.singularize(modelPathName)
      const modelDefinition = require(modelDir)(Sequelize)
      await func(db, modelName, modelDefinition)
    }
    return db
  }

  // verbose && console.log(`Searching subdirectories for model definitions: ${modelPathNames}`)

  iterateModelPaths(db, modelPathNames, buildModel)
    .then(async (db) => {
      return await iterateModelPaths(db, modelPathNames, buildAssociations)
    })
    .then(async (db) => {
      await iterateModelPaths(db, modelPathNames, buildSeeds)
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
