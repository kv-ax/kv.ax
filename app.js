const express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , bodyParser = require('body-parser')
  , apikey = "6798030e2fecd18690cf32abb47ba148-4412457b-c158f2bb"
  , domain = "kv.ax"
  , mg = require('mailgun-js')({apiKey: apikey, domain: domain})
  , fs = require('fs')
  , pug = require('pug')
const port = 9000

var app = express()

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.render('index',
    { 
      cssPath: 'stylesheets/style.css',
      title : 'Konstantin Velitchko',
      description : 'This is a description' 
    }
  )
})
app.get('/coinme', (req, res) => {
  res.render('coinme',
  {
    cssPath : 'stylesheets/style.css',
    title : 'Coinme',
    description : ''
  })
})
app.get('/trip+planner', (req, res) => {
  res.render('trip',
  {
    cssPath : 'stylesheets/style.css',
    title : 'Trip Planner',
    description : ''
  })
})
app.get('/butter+home', (req, res) => {
  res.render('butter',
  {
    cssPath : 'stylesheets/style.css',
    title : 'butter',
    description : ''
  })
})
app.get('/contact', (req, res) => {
  res.render('contact',
    { 
      cssPath: 'stylesheets/style.css',
      title : 'Contact - Konstantin Velitchko',
      description : 'Contact me at me@kv.ax or 425-598-4796' 
    }
  )
})
app.post('/contact/send', function(req, res, next) {
  var html = pug.renderFile('views/mail.pug', {
    title: 'Thank you for contacting me!',
    headerdescription: 'Thank you for contacting me!',
    headertitle: 'kv.ax',
    iurl: 'https://kv.ax/',
    image: 'https://i.kv.ax/banner.png',
    title: 'I\'ll get back to you soon!',
    caption: 'I typically respond in 5-900 days',
    logourl: 'https://kv.ax',
    logo: 'https://i.kv.ax/Logo.png',
    linkedin: 'https://www.linkedin.com/in/konstantinvelitchko/',
    linkedinimg: 'https://i.kv.ax/linkedin.png',
    contenttitle: 'Hello '+req.body.name+'!',
    content: 'Your message came through and you should expect to hear from me pretty soon. Below is what you sent me:',
    message: req.body.message
  })

  var mailOptions = 
  {
    from: 'Konstantin Velitchko <me@kv.ax>',
    to: req.body.email,
    subject: 'Your message came through!',
    html: html
  }
  mg.messages().send(mailOptions, function (error, body) {
    res.redirect('/')
  })
})
app.get('/sms', (req, res) => {
  res.redirect('sms://14255984796')
})
app.get('*', function(req, res){
  res.redirect('/')
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))