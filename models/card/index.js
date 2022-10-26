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
        front: 'Ps 83:18',
        back: 'This is a test'
      },
      {
        front: 'Test',
        back: 'This is another test'
      }
    ]
  }
}
