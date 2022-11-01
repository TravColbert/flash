module.exports = function (orm, db) {
  return {
    definition: {
      sequence: orm.TEXT,
      length: orm.INTEGER
    },
    association: async (db) => {
      await db.models.quiz.belongsTo(db.models.tag)
    },
    seed: {
      sequence: '[1,2,3,4,5]',
      length: 5,
      tagId: 1
    }
  }
}
