var passport = require('passport'),
  UserModel = require('./model/user.js'),
  sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);


module.exports = function (app) {

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  }

  // app.get('/', ensureAuthenticated, function (req, res) {
  //   res.render('index', {
  //     active: "home",
  //     user: req.user
  //   });
  // });

  app.get('/', function (req, res) {
    res.render('index', {
      active: "home",
      user: req.user
    });
  });

  app.get('/record', function (req, res) {
    res.render('record', {
      active: "home",
      user: req.user
    });
  });

  app.post('/', function (req, res) {
    req.assert('email', 'required').notEmpty();
    req.assert('email', 'valid email required').isEmail();

    var errors = req.validationErrors();

    if (!errors) {
      var emailText = '<html> <head> <meta http-equiv="content-type" content="text/html; charset=ISO-8859-15"> </head> <body text="#000000" bgcolor="#FFFFFF"> Wir lieben Feedback! <br> <div class="moz-forward-container"><br> <video style="display: block;" autoplay="autoplay" clipid="532383" poster="https://sc.liveclicker.net/service/clip?kind=poster&amp;ID=532383&amp;type=1" controls="controls" src="https://sc.liveclicker.net/service/clip?kind=video&amp;ID=532383&amp;type=1" height="180" width="320"><a moz-do-not-send="true" href="http://em.liveclicker.net/service/clip?kind=clickthrough&amp;ID=532383&amp;type=1" alt="Redirect"><img moz-do-not-send="true" src="cid:part1.07080905.09000202@gmail.com" alt="Video clip" style="display:block;" height="180" width="320" border="0"></a></video><br> Sag uns deine Meinung!<br> </div> <br> </body> </html>';
      sendgrid.send({
        to: req.body.email,
        // toname: 'Lars Butzmann',
        from: 'order@v0ice.de',
        fromname: 'v0ice Inc.',
        subject: 'Example email with HTML5 video',
        text: 'Sending email with NodeJS through SendGrid!',
        html: (req.body.inputText !== '') ? req.body.inputText : emailText
      });

      res.redirect('/');
    } else {
      res.render('index', {
        message: '',
        errors: errors
      });
    }
  });

  app.get('/register', function(req, res) {
    res.render('register', {
      active: "home"
    });
  });

  app.post('/register', function(req, res) {
    req.assert('username', 'Username is required').notEmpty();
    req.assert('password', 'Password is too short').len(6, 20);
    req.assert('password', 'Passwords do not match').equals(req.body.password_confirmation);

    var errors = req.validationErrors();

    if (!errors){
      UserModel.register(new UserModel({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render('register', { user : account });
        }
        res.redirect('/');
      });
    } else {
      res.render('register', {
        message: '',
        errors: errors
      });
    }
  });

  app.get('/login', function(req, res) {
    res.render('login', {
      active: "home"
    });
  });

  app.post('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })
  );

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // API
  app.get('/api', function (req, res) {
    res.send('API is running');
  });
}