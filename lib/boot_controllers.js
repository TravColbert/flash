'use strict'

/**
 * Module dependencies.
 */

const express = require('express')
const fs = require('fs')
const path = require('path')
const inflection = require('inflection')
const authHelper = require('./authentication')()

const printRoute = function (beforeEnabled, method, url, key) {
  const routeTemplate = beforeEnabled ? '\t%s\t%s -> before -> %s' : '\t%s\t%s -> %s'
  console.log(
    routeTemplate,
    method.toUpperCase(),
    url,
    key
  )
}

module.exports = function (parent, options) {
  const controllerPath = path.join(__dirname, '..', 'controllers')
  const verbose = options.verbose

  const db = options.db || {}

  const auth = options.auth || false

  const controllerPathNames = fs.readdirSync(controllerPath)

  // Global authentication routes
  if (auth) {
    parent.use('/login', auth.authenticate('oidc'))

    parent.use('/callback',
      auth.authenticate('oidc', {
        successRedirect: '/',
        failureRedirect: '/login'
      })
    )

    parent.post('/logout', function (req, res, next) {
      req.logout((err) => {
        if (err) return next(err)
        req.session.destroy()
        res.redirect('/')
      })
    })

    parent.use('/profile', authHelper.ensureLoggedIn, (req, res) => {
      if (req.isAuthenticated()) {
        return res.render('profile', { user: req.user })
      }
      return res.redirect('/login')
    })
  }

  for (let name of controllerPathNames) {
    const controllerDir = path.join(controllerPath, name)
    if (!fs.statSync(controllerDir).isDirectory()) return
    const app = express()

    verbose && console.log(' %s:', name)
    const controllerModule = path.join(controllerDir, 'index.js')

    try {
      fs.accessSync(controllerModule, fs.constants.R_OK)
    } catch (err) {
      console.log(err)
      continue
    }

    const controller = require(controllerModule)(db, authHelper)

    // allow specifying the view engine
    if (controller.engine) app.set('view engine', controller.engine)
    app.set('views', path.join(__dirname, '..', 'controllers', name, 'views'))
    verbose && console.log('\tVIEWS\t%s', app.get('views'))

    // Continue setting up default controller routes
    name = inflection.singularize(controller.name || name)
    const routeBaseName = inflection.pluralize(name)
    const prefix = controller.prefix || ''

    let handler
    let method
    let url

    // generate routes based
    // on the exported methods
    for (const key in controller) {
      // "reserved" exports
      if (~['name', 'prefix', 'engine', 'before', '_authenticate'].indexOf(key)) continue
      // route exports
      switch (key) {
        case 'edit':
          method = 'get'
          url = `/${routeBaseName}/:${name}Id/edit`
          break
        case 'show':
          method = 'get'
          url = `/${routeBaseName}/:${name}Id/`
          break
        case 'update':
          method = 'put'
          url = `/${routeBaseName}/:${name}Id/`
          break
        case 'delete':
          method = 'delete'
          url = `/${routeBaseName}/:${name}Id/`
          break
        case 'new':
          method = 'get'
          url = `/${routeBaseName}/new`
          break
        case 'list':
          method = 'get'
          url = `/${routeBaseName}`
          break
        case 'create':
          method = 'post'
          url = `/${routeBaseName}`
          break
        case 'index':
          method = 'get'
          url = '/'
          break
        default:
          /* istanbul ignore next */
          throw new Error('unrecognized route: ' + name + '.' + key)
      }

      // setup
      handler = controller[key]
      url = prefix + url

      const middlewareStack = [handler]
      // before middleware support
      printRoute(controller.before, method, url, key)

      // 'before' middleware
      if (controller.before) middlewareStack.unshift(controller.before)

      // 'authenticate' middleware
      if (('_authenticate' in controller) && ~controller._authenticate.indexOf(key)) middlewareStack.unshift(authHelper.ensureLoggedIn)

      app[method](url, middlewareStack)
    }

    // mount the app
    parent.use(app)
  }
}
