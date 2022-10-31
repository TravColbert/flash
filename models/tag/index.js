module.exports = function (orm) {
  return {
    definition: {
      name: orm.STRING
    },
    association: async (db) => {
      await db.models.tag.belongsToMany(db.models.card, { through: 'CardTag' })
      await db.models.tag.hasMany(db.models.quiz)
      await db.models.tag.hasMany(db.models.unicorn)
    },
    seed: {
      name: 'Animals'
    }
  }
}
