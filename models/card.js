module.exports = function (orm) {
  return {
    definition: {
      front: orm.TEXT,
      back: orm.TEXT
    },
    association: async (db) => {
      await db.models.card.belongsToMany(db.models.tag, { through: 'CardTag' })
    },
    seed: [
      {
        front: 'Aardvark',
        back: 'A medium-sized, burrowing, nocturnal mammal native to Africa. It is the only living species of the order Tubulidentata, although other prehistoric species and genera of Tubulidentata are known. Unlike most other insectivores, it has a long pig-like snout, which is used to sniff out food.'
      }
    ]
  }
}
