'use strict'

module.exports = function (db) {
  const model = db.models.card

  return {
    before: (req, res, next) => {
      const card = model.findByPk(req.params.card_id)
      if (!card) return next('route')
      req.card = card
      next()
    },
    list: (req, res, next) => {
      const cards = model.findAll()
      console.log(`CARD LIST: ${cards.length}`)
      res.render('card', { cards })
    },
    edit: (req, res, next) => {
      res.render('edit', { card: req.card })
    },
    delete: (req, res, next) => {
      model.findByPk(req.params.card_id).destroy()
      res.redirect('/cards')
    },
    show: (req, res, next) => {
      res.render('show', { card: req.card })
    },
    update: (req, res, next) => {
      model.find(req.body.card.id).update(req.body.card)
      res.message('Card updated')
      res.redirect('/cards/' + req.card.id)
    }
  }
}
