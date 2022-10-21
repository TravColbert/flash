'use strict'

module.exports = function (db) {
  return {
    before: (req, res, next) => {
      const card = db.find(req.params.card_id)
      if (!card) return next('route')
      req.card = card
      next()
    },
    list: (req, res, next) => {
      console.log('HELLO? From card')
      res.render('card')
    },
    edit: (req, res, next) => {
      res.render('edit', { pet: req.pet })
    },
    // delete: (req, res, next) => {
    //   const searchRecord = db.findIndex((pet) => pet.id === req.pet.id);
    //   if (searchRecord === -1) return next("route");
    //   db.pets.splice(searchRecord, 1);
    //   res.redirect("/pets");
    // },
    show: (req, res, next) => {
      res.render('show', { pet: req.pet })
    },
    update: (req, res, next) => {
      // var body = req.body;
      req.pet.name = req.body.pet.name
      res.message('Information updated!')
      res.redirect('/pets/' + req.pet.id)
    }
  }
}
