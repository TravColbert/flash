module.exports = function (orm) {
  return {
    definition: {
      sequence: orm.TEXT,
      length: orm.INTEGER
    },
    association: async (db) => {
      db.models.quiz.belongsTo(db.models.tag, { through: 'QuizTag' })
    }
  }
}
