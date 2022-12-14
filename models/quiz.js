module.exports = function (orm, db) {
  return {
    definition: {
      sequence: orm.TEXT,
      length: orm.INTEGER,
      side: {
        type: orm.ENUM,
        values: ['front', 'back', 'any']
      },
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
      await db.models.quiz.belongsTo(db.models.tag)
    },
    seed: {
      sequence: '[0,1,2,3,4]',
      length: 5,
      side: 'front',
      tagId: 1,
      public: true
    }
  }
}
