'use strict'

module.exports = function (db) {
  const model = db.models.tag

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
      model.findByPk(req.params.tag_id)
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
      model.findAll({ order: [['name', 'ASC']] })
        .then(tags => {
          res.render('list', { tags })
        })
    },
    new: (req, res, next) => {
      res.render('new')
    }
  }
}
