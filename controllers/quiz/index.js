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
      console.log({
        sequence,
        length,
        tagId
      })
      db.models.quiz.create({
        sequence,
        length,
        tagId
      })
        .then(() => {
          res.redirect('/quizzes')
        })
        .catch((err) => {
          console.log(err)
          next(err)
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
          console.log(err)
          next(err)
        })
    },
    new: async (req, res, next) => {
      const tags = await db.models.tag.findAll()
      res.render('new', { tags })
    }
  }
}
