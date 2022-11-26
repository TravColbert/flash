'use strict'

module.exports = function (db, authHelper) {
  const formatTemplateName = (res, baseTemplate) => {
    return (res.locals.templateModifier) ? `_${baseTemplate}_${res.locals.templateModifier}` : baseTemplate
  }

  const model = 'todo'
  const modelId = 'todoId'
  const modelPath = '/todos'

  return {
    before: (req, res, next) => {
      res.locals.templateModifier = ('_format' in req.query) ? req.query._format : false
      next()
    },
    create: (req, res, next) => {
      const completed = req.body[model]?.completed || false
      const createObj = { ...req.body[model], completed }
      db.models[model].create(createObj)
        .then(() => {
          req.session.messages.push({
            type: 'success',
            text: 'Todo created'
          })
        })
        .catch((err) => {
          console.log(err)
          req.session.messages.push({
            type: 'fail',
            text: 'Failed to create todo'
          })
        })
        .finally(() => {
          res.redirect(`${modelPath}?_format=block`)
        })
    },
    delete: (req, res, next) => {
      db.models[model].findByPk(req.params[modelId])
        .then(async model => {
          await model.destroy()
        })
        .then(() => {
          req.session.messages.push({
            type: 'success',
            text: 'Todo deleted'
          })
        })
        .catch(() => {
          req.session.messages.push({
            type: 'fail',
            text: 'Failed to delete todo'
          })
        })
        .finally(() => {
          res.redirect(`${modelPath}?_format=block`)
        })
    },
    edit: (req, res, next) => {
      db.models[model].findByPk(req.params[modelId])
        .then(async (model) => {
          res.render('edit', { model })
        })
        .catch(() => {
          req.session.messages.push({
            type: 'fail',
            text: 'Can\'t find that todo'
          })
          res.redirect(modelPath)
        })
    },
    list: (req, res, next) => {
      const searchClause = {
        order: [['createdAt', 'DESC']]
      }
      const filter = ('filter' in req.query) ? req.query.filter : 'all'
      db.models[model].findAll(searchClause)
        .then(todos => {
          return res.render(formatTemplateName(res, 'list'), { todos, filter })
        })
    },
    update: (req, res, next) => {
      const modelUpdate = req.body[model] || {}
      db.models[model].findByPk(req.params[modelId])
        .then(async (model) => {
          model.completed = ('completed' in modelUpdate)
          model.title = ('title' in modelUpdate) ? modelUpdate.title : model.title
          await model.save()
          req.session.messages.push({
            type: 'success',
            text: 'Todo updated'
          })
        })
        .catch((err) => {
          console.log(err)
          req.session.messages.push({
            type: 'fail',
            text: 'Failed to update todo'
          })
        })
        .finally(() => {
          res.redirect(`${modelPath}?_format=block`)
        })
    }
  }
}
