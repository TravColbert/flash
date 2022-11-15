'use strict'

const { Op } = require('sequelize')

module.exports = function (db, authHelper) {
  return {
    _authenticate: ['create', 'delete', 'edit', 'new', 'update'],
    before: (req, res, next) => {
      console.log(req.body)
      next()
    },
    create: (req, res, next) => {
      const isPublic = ('public' in req.body.card)
      const createObj = { ...req.body.card, public: isPublic, owner: res.locals.user.id }
      console.log(createObj)
      db.models.card.create(createObj)
        .then(async (card) => {
          const tags = req.body.card.tags !== undefined ? req.body.card.tags : null
          await card.setTags(tags)
          return card
        })
        .then(card => {
          req.session.messages.push({
            type: 'success',
            text: `Card '${card.front}' created`
          })
        })
        .catch((err) => {
          console.log(err)
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
      db.models.card.findByPk(req.params.cardId)
        .then(async card => {
          await card.destroy()
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
      db.models.card.findByPk(req.params.cardId, { include: db.models.tag })
        .then(async (card) => {
          const tags = await db.models.tag.findAll()
          res.render('edit', { card, tags })
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
      const searchClause = {
        where: {
          public: true
        },
        order: [['front', 'ASC']],
        include: db.models.tag
      }
      if (req.isAuthenticated()) {
        searchClause.where = {
          [Op.or]: [
            { owner: res.locals.user?.id },
            { public: true }
          ]
        }
      }
      db.models.card.findAll(searchClause)
        .then(cards => {
          res.render('list', { cards })
        })
    },
    new: async (req, res, next) => {
      const tags = await db.models.tag.findAll()
      res.render('new', { tags })
    },
    show: (req, res, next) => {
      db.models.card.findByPk(req.params.cardId, { include: db.models.tag })
        .then(card => {
          res.render('show', { card })
        })
        .catch((err) => {
          console.log(err)
          req.session.messages.push({
            type: 'fail',
            text: 'Can\'t find that card'
          })
          res.redirect('/cards')
        })
    },
    update: (req, res, next) => {
      db.models.card.findByPk(req.body.card.id)
        .then(async (card) => {
          await card.update(req.body.card)
          const tags = req.body.card.tags !== undefined ? req.body.card.tags : null
          await card.setTags(tags)
          req.session.messages.push({
            type: 'success',
            text: 'Card updated'
          })
        })
        .catch((err) => {
          console.log(err)
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
