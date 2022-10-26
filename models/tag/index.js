module.exports = function (orm) {
  return {
    definition: {
      name: orm.STRING
    },
    association: async (db) => {
      db.models.tag.belongsToMany(db.models.card, { through: 'CardTag' })
    },
    seed: {
      name: 'test'
    }
  }
}
