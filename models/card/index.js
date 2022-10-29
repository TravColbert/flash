module.exports = function (orm) {
  return {
    definition: {
      front: orm.TEXT,
      back: orm.TEXT
    },
    association: async (db) => {
      db.models.card.belongsToMany(db.models.tag, { through: 'CardTag' })
    },
    seed: [
      {
        front: 'Test Card 1',
        back: 'This the FIRST test'
      }
    ]
  }
}
