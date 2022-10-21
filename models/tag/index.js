module.exports = function (orm, db, tableName) {
  console.log(` building ${tableName} model`)
  return db.define(tableName, {
    name: orm.STRING
  })
}
