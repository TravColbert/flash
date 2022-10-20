const fs = require('fs')
const path = require('path')

// Setup ORM
const Sequelize = require('sequelize')
const db = new Sequelize({
  // The `host` parameter is required for other databases
  // host: 'localhost'
  dialect: 'sqlite',
  storage: 'db/database.sqlite'
})

// Test connectivity
db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })

module.exports = function (options) {
  const modelPath = path.join(__dirname, '..', 'models')
  const verbose = options.verbose
  fs.readdirSync(modelPath).forEach(function (name) {
    const modelDir = path.join(modelPath, name)
    verbose && console.log(' %s : %s', name, modelDir)
    require(modelDir)(db)
    db
      .sync()
      .then(() => {
        console.log(`${name} model created`)
      })
  })
}
