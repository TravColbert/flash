module.exports = function (orm, db, tableName) {
  console.log(` building ${tableName} model`)
  return db.define(tableName, {
    front: orm.TEXT,
    back: orm.TEXT
  })
}
