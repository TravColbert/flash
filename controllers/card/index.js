"use strict";

/**
 * Module dependencies.
 */

// var db = require("../../db");

module.exports = function (db) {
  db.findAll();
};

// exports.before = function(req, res, next){
//   var pet = db.pets[req.params.pet_id];
//   if (!pet) return next('route');
//   req.pet = pet;
//   next();
// };

// exports.edit = function(req, res, next){
//   res.render('edit', { pet: req.pet });
// };

// exports.delete = function(req, res, next) {
//   searchRecord = db.pets.findIndex(pet => pet.id === req.pet.id);
//   if (searchRecord === -1) return next('route');
//   db.pets.splice(searchRecord, 1);
//   res.redirect('/pets');
// };

exports.list = function (req, res, next) {
  console.log("HELLO? From card");
  res.render("card");
};

// exports.show = function(req, res, next){
//   res.render('show', { pet: req.pet });
// };

// exports.update = function(req, res, next){
//   var body = req.body;
//   req.pet.name = body.pet.name;
//   res.message('Information updated!');
//   res.redirect('/pets/' + req.pet.id);
// };
