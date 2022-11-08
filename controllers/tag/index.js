'use strict'

const authHelper = require('../../lib/authentication')

module.exports = function (db) {
  return {
    before: (req, res, next) => {
      console.log('executing before()...')
      authHelper.ensureLoggedIn(req, res, next)
      next()
    },
    create: (req, res, next) => {
      if (!req.body.tag.name || req.body.tag.name === '') {
        req.session.messages.push({
          type: 'error',
          text: 'Tag name cannot be blank'
        })
        return res.render('new')
      }
      db.models.tag.create(req.body.tag)
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
      // model.findAll({ order: [['name', 'ASC']] })
      db.models.tag.findAll()
        .then(tags => {
          res.render('list', { tags })
        })
    },
    new: (req, res, next) => {
      res.render('new')
    }
  }
}
