'use strict'

module.exports = (db) => {
  return {
    list: (req, res, next) => {
      db.models.quiz.findAll({
        include: [{
          model: db.models.tag
        }]
      })
        .then(quizzes => {
          res.render('list', { quizzes })
        })
    },
    new: async (req, res, next) => {
      const tags = await db.models.tag.findAll()
      res.render('new', { tags })
    }
  }
}
