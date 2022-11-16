'use strict'

const { Op } = require('sequelize')

module.exports = function (db) {
  return {
    _authenticate: ['create', 'delete', 'list', 'new'],
    // before: (req, res, next) => {
    //   next()
    // },
    create: (req, res, next) => {
      if (!req.body.tag.name || req.body.tag.name === '') {
        req.session.messages.push({
          type: 'error',
          text: 'Tag name cannot be blank'
        })
        return res.render('new')
      }
      const isPublic = ('public' in req.body.tag)
      const createObj = { ...req.body.tag, public: isPublic, owner: res.locals.user.id }
      db.models.tag.create(createObj)
        .then(model => {
          req.session.messages.push({
            type: 'success',
            text: `Tag '${model.name}' created`
          })
        })
        .catch(() => {
          req.session.messages.push({
            type: 'error',
            text: 'Failed to create tag'
          })
        })
        .finally(() => {
          res.redirect('/tags')
        })
    },
    delete: (req, res, next) => {
      db.models.tag.findByPk(req.params.tagId)
        .then(tag => {
          return tag.destroy()
        })
        .then(() => {
          req.session.messages.push({
            type: 'success',
            text: 'Tag deleted'
          })
        })
        .catch(() => {
          req.session.messages.push({
            type: 'error',
            text: 'Failed to delete tag'
          })
        })
        .finally(() => {
          res.redirect('/tags')
        })
    },
    list: (req, res, next) => {
      const whereClause = {
        where: {
          public: true
        }
      }
      if (req.isAuthenticated()) {
        whereClause.where = {
          [Op.or]: [
            { owner: res.locals.user?.id },
            { public: true }
          ]
        }
      }

      db.models.tag.findAll(whereClause, {
        order: [['name', 'ASC']]
      })
        .then(tags => {
          res.render('list', { tags })
        })
    },
    new: (req, res, next) => {
      res.render('new')
    }
  }
}
