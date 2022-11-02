'use strict'

const shuffle = require('shuffle-array')

module.exports = (db) => {
  const createSequence = function (length = 10) {
    const sequence = []
    for (let i = 1; i <= length; i++) {
      sequence.push(i)
    }
    console.log(sequence)
    return shuffle(sequence)
  }

  return {
    create: (req, res, next) => {
      const length = req.body.quiz.length || 10
      const tagId = req.body.quiz.tag
      const sequence = JSON.stringify(createSequence(length))
      db.models.quiz.create({ sequence, length, tagId })
        .then(() => {
          res.redirect('/quizzes')
        })
        .catch((err) => {
          console.log(err)
          next(err)
        })
    },
    delete: (req, res, next) => {
      db.models.quiz.findByPk(req.params.quizId)
        .then(quiz => {
          return quiz.destroy()
        })
        .then(() => {
          req.session.messages.push({
            type: 'success',
            text: 'Quiz deleted'
          })
        })
        .catch((err) => {
          console.log(err)
          req.session.messages.push({
            type: 'fail',
            text: 'Failed to delete quiz'
          })
        })
        .finally(() => {
          res.redirect('/quizzes')
        })
    },
    list: (req, res, next) => {
      db.models.quiz.findAll({
        include: [{
          model: db.models.tag
        }]
      })
        .then(quizzes => {
          res.render('list', { quizzes })
        })
        .catch(err => {
          next(err)
        })
    },
    new: async (req, res, next) => {
      const tags = await db.models.tag.findAll()
      res.render('new', { tags })
    },
    show: (req, res, next) => {
      db.models.quiz.findByPk(req.params.quizId, { include: db.models.tag })
        .then(quiz => {
          if (!quiz) {
            req.session.messages.push({
              type: 'fail',
              text: 'Could not find that quiz'
            })
            res.redirect('/quizzes')
          }
          res.render('show', { quiz })
        })
        .catch(err => {
          next(err)
        })
    }
  }
}
