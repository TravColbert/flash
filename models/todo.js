module.exports = function (orm) {
  return {
    name: 'todo',
    definition: {
      title: orm.TEXT,
      completed: {
        type: orm.BOOLEAN,
        default: false
      },
      owner: {
        type: orm.STRING,
        allowNull: true
      }
    }
  }
}
