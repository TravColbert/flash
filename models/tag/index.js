module.exports = function (orm) {
  return {
    definition: {
      name: orm.STRING
    },
    association: async (db) => {
      db.models.tag.belongsToMany(db.models.card, { through: 'CardTag' })
      db.models.tag.hasMany(db.models.quiz, { through: 'QuizTag' })
    },
    seed: {
      name: 'test'
    }
  }
}
