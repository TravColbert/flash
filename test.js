"use strict";

const path = require("path");

const db = {
  fruits: ["apple", "orange", "pear"],
  veggies: ["brocolli", "kale", "spinach"],
};

const controllerDir = path.join(__dirname, "controllers", "card");
console.log(controllerDir);
const test = require(controllerDir)(db);

// console.log(Object.keys(test));
// console.log(test.fruits());
// console.log(test.add_fruit("tomato"));
// console.log(test.fruits());
// console.log(db);
// console.log(test.db);
