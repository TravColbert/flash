'use strict'

module.exports = (db) => {
  return {
    list: (req, res, next) => {
      db.models.unicorn.findAll({
        include: db.models.tag
      })
        .then(unicorns => {
          res.render('list', { unicorns })
        })
    },
    new: async (req, res, next) => {
      const tags = await db.models.tag.findAll()
      res.render('new', { tags })
    }
  }
}
