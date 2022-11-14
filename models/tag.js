module.exports = function (orm) {
  return {
    order: 1,
    definition: {
      name: orm.STRING,
      owner: {
        type: orm.STRING,
        allowNull: true
      },
      public: {
        type: orm.BOOLEAN,
        defaultValue: false
      }
    },
    association: async (db) => {
      await db.models.tag.belongsToMany(db.models.card, { through: 'CardTag' })
      await db.models.tag.hasMany(db.models.quiz, {
        foreignKey: 'tagId'
      })
    },
    seed: {
      name: 'Animals',
      public: true
    }
  }
}
