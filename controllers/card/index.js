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
        .then(async (card) => {
          console.log(req.body)
          const tag = await db.models.tags.findByPk(req.body.tags)
          return await card.setTag(tag)
        })
        .then(card => {
          req.session.messages.push({
            type: 'success',
            text: `Card '${card.front}' created`
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
      console.log(`Fetching card: ${req.params.card_id}`)
      model.findByPk(req.params.card_id)
        .then(card => {
          console.log(card)
          res.render('edit', { card })
        })
        .catch(() => {
          req.session.messages.push({
            type: 'fail',
            text: 'Can\'t find that card'
          })
          res.redirect('/cards')
        })
    },
    list: (req, res, next) => {
      model.findAll({ order: [['front', 'ASC']] })
        .then(cards => {
          res.render('list', { cards })
        })
    },
    new: async (req, res, next) => {
      const tags = await db.models.tag.findAll()
      res.render('new', { tags })
    },
    show: (req, res, next) => {
      model.findByPk(req.params.card_id)
        .then(card => {
          res.render('show', { card })
        })
        .catch(() => {
          req.session.messages.push({
            type: 'fail',
            text: 'Can\'t find that card'
          })
          res.redirect('/cards')
        })
    },
    update: (req, res, next) => {
      console.log(req.body.card)
      model.findByPk(req.body.card.id)
        .then(card => {
          card.update(req.body.card)
          req.session.messages.push({
            type: 'success',
            text: 'Card updated'
          })
        })
        .catch(() => {
          req.session.messages.push({
            type: 'fail',
            text: 'Failed to update card'
          })
        })
        .finally(() => {
          res.redirect(`/cards/${req.body.card.id}`)
        })
    }
  }
}
