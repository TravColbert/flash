'use strict'

module.exports = function (db) {
  return {
    // before: (req, res, next) => {
    //   console.log('executing before()...')
    //   next()
    // },
    create: (req, res, next) => {
      db.models.tag.create(req.body)
        .then(model => {
          req.session.messages.push({
            type: 'success',
            text: `Tag '${model.name}' created`
          })
        })
        .catch(() => {
          req.session.messages.push({
            type: 'fail',
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
            type: 'fail',
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
