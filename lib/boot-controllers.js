"use strict";

/**
 * Module dependencies.
 */

const express = require("express");
const fs = require("fs");
const path = require("path");

module.exports = function (parent, options) {
  const controllerPath = path.join(__dirname, "..", "controllers");
  const verbose = options.verbose;

  const db = options.db || {};

  console.log(db);

  fs.readdirSync(controllerPath).forEach(function (name) {
    const controllerDir = path.join(controllerPath, name);
    if (!fs.statSync(controllerDir).isDirectory()) return;
    // verbose && console.log("\n   %s:", name);
    // verbose && console.log(require(controllerDir));
    const controller = require(controllerDir)(db);
    // verbose && console.log(Object.keys(controller));
    name = controller.name || name;
    const prefix = controller.prefix || "";
    const app = express();
    let handler;
    let method;
    let url;

    // allow specifying the view engine
    if (controller.engine) app.set("view engine", controller.engine);
    app.set("views", path.join(__dirname, "..", "controllers", name, "views"));

    // generate routes based
    // on the exported methods
    for (const key in controller) {
      // "reserved" exports
      if (~["name", "prefix", "engine", "before"].indexOf(key)) continue;
      // route exports
      switch (key) {
        case "delete":
          method = "delete";
          url = "/" + name + "s/:" + name + "_id/delete";
          break;
        case "edit":
          method = "get";
          url = "/" + name + "s/:" + name + "_id/edit";
          break;
        case "show":
          method = "get";
          url = "/" + name + "s/:" + name + "_id";
          break;
        case "update":
          method = "put";
          url = "/" + name + "s/:" + name + "_id";
          break;
        case "new":
          method = "get";
          url = "/" + name + "s/new";
          break;
        case "list":
          method = "get";
          url = "/" + name + "s";
          break;
        case "create":
          method = "post";
          url = "/" + name;
          break;
        case "index":
          method = "get";
          url = "/";
          break;
        default:
          /* istanbul ignore next */
          throw new Error("unrecognized route: " + name + "." + key);
      }

      // setup
      handler = controller[key];
      url = prefix + url;

      verbose && console.log(url);

      // before middleware support
      if (controller.before) {
        app[method](url, controller.before, handler);
        verbose &&
          console.log(
            "     %s %s -> before -> %s",
            method.toUpperCase(),
            url,
            key
          );
      } else {
        app[method](url, handler);
        verbose &&
          console.log("     %s %s -> %s", method.toUpperCase(), url, key);
      }
    }

    // mount the app
    parent.use(app);
  });
};
