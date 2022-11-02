"use strict";

/**
 * Module dependencies.
 */

var db = require("../../db");

exports.before = function (req, res, next) {
  var pet = db.pets[req.params.petId];
  req.pet = !pet ? {} : pet;
  next();
};

exports.edit = function (req, res, next) {
  res.render("edit", { pet: req.pet });
};

exports.delete = function (req, res, next) {
  searchRecord = db.pets.findIndex((pet) => pet.id === req.pet.id);
  if (searchRecord === -1) return next("route");
  db.pets.splice(searchRecord, 1);
  res.redirect("/pets");
};

exports.list = function (req, res, next) {
  res.render("list", { pets: db.pets });
};

exports.show = function (req, res, next) {
  res.render("show", { pet: req.pet });
};

exports.update = function (req, res, next) {
  var body = req.body;
  req.pet.name = body.pet.name;
  res.message("Information updated!");
  res.redirect("/pets/" + req.pet.id);
};
