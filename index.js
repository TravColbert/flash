'use strict'
require('dotenv').config()
const config = require('config')

/**
 * Module dependencies.
 */
const express = require('express')
const logger = require('morgan')
const path = require('path')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const methodOverride = require('method-override')

const passport = require('passport')
const { Strategy } = require('passport-openidconnect')

const app = (module.exports = express())

// set our default template engine to "Pug"
app.set('view engine', 'pug')

// disable caching
app.disable('etag')

// set views for error and 404 pages
app.set('views', path.join(__dirname, 'views'))

// define a custom res.message() method
// which stores messages in the session
app.response.message = function (msg) {
  // reference `req.session` via the `this.req` reference
  const sess = this.req.session
  // simply add the msg to an array for later
  sess.messages = sess.messages || []
  sess.messages.push(msg)
  return this
}

// log
if (!module.parent) app.use(logger('dev'))

// serve static files
app.use(express.static(path.join(__dirname, 'public')))

// session support
app.use(
  session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: process.env.APP_SECRET,
    saveUninitialized: false // don't create session until something stored
  })
)

app.use(passport.initialize())
app.use(passport.session())

// set up passport
passport.use('oidc', new Strategy({
  issuer: `https://${process.env.OKTA_DOMAIN}/oauth2/default`,
  authorizationURL: `https://${process.env.OKTA_DOMAIN}/oauth2/default/v1/authorize`,
  tokenURL: `https://${process.env.OKTA_DOMAIN}/oauth2/default/v1/token`,
  userInfoURL: `https://${process.env.OKTA_DOMAIN}/oauth2/default/v1/userinfo`,
  clientID: process.env.OKTA_OAUTH2_CLIENT_ID,
  clientSecret: process.env.OKTA_OAUTH2_CLIENT_SECRET,
  callbackURL: `${process.env.HOST_URL}/callback`,
  scope: 'openid profile'
}, (issuer, profile, done) => {
  return done(null, profile)
}))

passport.serializeUser((user, next) => {
  next(null, user)
})

passport.deserializeUser((obj, next) => {
  next(null, obj)
})

// parse request bodies (req.body)
app.use(express.urlencoded({ extended: true }))

// allow overriding methods in query (?_method=put)
app.use(methodOverride('_method'))

// expose the "messages" local variable when views are rendered
app.use(function (req, res, next) {
  const msgs = req.session.messages || []

  // expose "messages" local variable
  res.locals.messages = msgs

  // expose "hasMessages"
  res.locals.hasMessages = !!msgs.length

  // empty or "flush" the messages so they
  // don't build up
  req.session.messages = []

  next()
})

app.use((req, res, next) => {
  res.locals.authenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

const dbConfig = ('DBCONFIG' in process.env) ? process.env.DBCONFIG : config.get('db')
const db = require('./lib/boot-models')(dbConfig)

require('./lib/boot-controllers')(app, { db, verbose: !module.parent, auth: passport })

app.use(function (err, req, res, next) {
  // log it
  if (!module.parent) console.error(err.stack)

  // error page
  res.status(500).render('5xx', { error: err })
})

// assume 404 since no middleware responded
app.use(function (req, res, next) {
  res.status(404).render('404', { url: req.originalUrl })
})

/* istanbul ignore next */
if (!module.parent) {
  app.listen(process.env.SERVER_PORT)
  console.log(`App started on port ${process.env.SERVER_PORT}`)
}
