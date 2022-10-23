'use strict'

module.exports = function (db) {
  const model = db.models.card

  return {
    // before: (req, res, next) => {
    //   console.log('executing before()...')
    //   next()
    // },
    create: (req, res, next) => {
      model.create(req.body)
        .then(model => {
          req.session.messages.push({
            type: 'success',
            text: `Card '${model.name}' created`
          })
        })
        .catch(() => {
          req.session.messages.push({
            type: 'fail',
            text: 'Failed to create card'
          })
        })
        .finally(() => {
          res.redirect('/cards')
        })
    },
    delete: (req, res, next) => {
      model.findByPk(req.params.card_id)
        .then(card => {
          return card.destroy()
        })
        .then(() => {
          req.session.messages.push({
            type: 'success',
            text: 'Card deleted'
          })
        })
        .catch(() => {
          req.session.messages.push({
            type: 'fail',
            text: 'Failed to delete card'
          })
        })
        .finally(() => {
          res.redirect('/cards')
        })
    },
    edit: (req, res, next) => {
      res.render('edit', { card: req.card })
    },
    list: (req, res, next) => {
      model.findAll({ order: [['front', 'ASC']] })
        .then(cards => {
          res.render('list', { cards })
        })
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
