'use strict'

const shuffle = require('shuffle-array')

module.exports = (db) => {
  const createSequence = function (length = 10) {
    const sequence = []
    for (let i = 0; i < length; i++) {
      sequence.push(i)
    }
    console.log(sequence)
    return shuffle(sequence)
  }

  return {
    create: (req, res, next) => {
      const length = req.body.quiz.length || 10
      const tagId = req.body.quiz.tag
      const side = req.body.quiz.side || 'front'
      const sequence = JSON.stringify(createSequence(length))
      db.models.quiz.create({ sequence, length, side, tagId })
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
      // params:
      //   step: index of the current point in the sequence
      //   side: front | back
      // console.log(req.params)
      // console.log(req.query)
      const step = parseInt(req.query.step) || 1
      const actualStep = (step - 1)
      console.log(actualStep)
      const showSide = req.query.side || 'front'
      db.models.quiz.findByPk(req.params.quizId, { include: db.models.tag })
        .then(async quiz => {
          if (!quiz) {
            req.session.messages.push({
              type: 'fail',
              text: 'Could not find that quiz'
            })
            res.redirect('/quizzes')
          }
          const sequence = JSON.parse(quiz.sequence)
          const cards = await quiz.tag.getCards({ order: ['id'] })
          quiz.step = step
          quiz.actualStep = actualStep
          quiz.currentCardIndex = sequence[actualStep]
          const card = cards[sequence[actualStep]]
          quiz.showSide = quiz.side !== 'any'
            ? showSide
            : ['front', 'back'][Math.floor(Math.random() * 2)]
          quiz.next = sequence.length > step ? (step + 1) : false
          quiz.previous = (step === 1 || !step) ? 1 : (step - 1)
          // console.log(quiz)
          res.render('show', { quiz, card })
        })
        .catch(err => {
          next(err)
        })
    }
  }
}
