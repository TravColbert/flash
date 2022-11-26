module.exports = function (orm) {
  return {
    name: 'todo',
    definition: {
      title: orm.TEXT,
      completed: {
        type: orm.BOOLEAN,
        allowNull: false,
        default: false
      },
      owner: {
        type: orm.STRING,
        allowNull: true
      }
    }
  }
}
