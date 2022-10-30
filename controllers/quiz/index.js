'use strict'

module.exports = (db) => {
  const model = db.models.quiz

  return {
    list: (req, res, next) => {
      model.findAll({
        order: [['front', 'ASC']],
        include: db.models.tag
      })
        .then(quizes => {
          res.render('list', { quizes })
        })
    },
    new: async (req, res, next) => {
      const tags = await db.models.tag.findAll()
      res.render('new', { tags })
    },
  }
}
