const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    // callback function is now required, so the third arg for err was added. Without you will get a deprecation warning.
    if (err) {
      console.log('Unabel to append to server.log.')
    }
  });
  next();
});

/* This is a small piece of middleware to stop the site when maintenance is being performed */
/* This stops because we do not call next(), as in the middleware piece above. */
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

// var currentYear = new Date().getFullYear();
// Replace the above variable with Handlebars helper called getCurrentYear
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

hbs.registerHelper('allCaps', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => { // get file, and pas in (request, response)
  /* Using just express, we can use res.send */
  // res.send('<h1>Hello Express!</h1>');
  // res.send({
  //   name: 'Carl',
  //   likes: [
  //     'Kayaking',
  //     'Snowboarding'
  //   ]
  // })
  /* When using Handlbars, we use res.render */
  res.render('home.hbs', {
    pageTilte: 'Some site',
    welcomeMessage: 'Hello, welcome to our website'
  })
});

app.get('/about', (req, res) => {
  // res.send('About Page');
  res.render('about.hbs', {
    pageTilte: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request.'
  })
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
