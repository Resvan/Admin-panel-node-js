const { response } = require('express');
var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers')


/* GET home page. */
router.get('/', function (req, res, next) {
  let products = [
    {
      name: "Apple iPhone 14 Pro Max 128 GB (Deep Purple, 6 GB RAM)",
      price: "MRP:  139,900",
      description: "Rear Camera: 48 MP + 12 MP + 12 MP Front Camera: 12 MP",
      image: "https://img2.gadgetsnow.com/gd/images/products/additional/large/G390852_View_1/mobiles/smartphones/apple-iphone-14-pro-max-128-gb-deep-purple-6-gb-ram-.jpg"
    },
    {
      name: "Apple iPhone 13 128 GB (Midnight, 4 GB RAM)",
      price: "MRP:  69,900",
      description: "Rear Camera: 12 MP + 12 MP Front Camera: 12 MP",
      image: "https://img6.gadgetsnow.com/gd/images/products/additional/large/G206586_View_1/mobiles/smartphones/apple-iphone-13-128-gb-midnight-4-gb-ram-.jpg"
    },
    {
      name: "Apple iPhone 12 Pro Max (Gold, 128GB)",
      price: "MRP:  109,000",
      description: "6.7 inches (16.37 cm) 458 ppi, (diagonal) all‑screen OLED Super Retina XDR Display, 128 GB ROM",
      image: "https://img5.gadgetsnow.com/gd/images/products/additional/large/G201720_View_1/mobiles/smartphones/apple-iphone-12-pro-max-gold-128gb-.jpg"
    },
    {
      name: "Apple iPhone 11 Pro 256 GB (Space Grey, 4GB RAM)",
      price: "MRP:  69,999",
      description: "Display: 5.8 Inches with a resolution of 2436 x 1125 Pixels and pixel density",
      image: "https://img4.gadgetsnow.com/gd/images/products/additional/large/G121406_View_2/mobiles/smartphones/apple-iphone-11-pro-256-gb-space-grey-4gb-ram-.jpg"
    }
  ]
  let user = req.session.user
  if (user) {
    res.render('user/index', { products, user });
  } else {
    res.redirect('/login')
  }
  
});

router.get('/login', (req, res) => {
  let user = req.session.user
if (user){
    res.redirect('/')
  } else
  res.render('user/login', { "loginErr": req.session.loginErr })
  req.session.loginErr = false
  
})

router.get('/signup', (req,res) => {
  res.render('user/signup', { signupError: req.session.signupError })
  signupError =false
})

router.post('/signup', (req, res) => {
  userHelpers.doSignp(req.body).then((response) => {
    if (response) {
      res.redirect('/login')
    } else {
      req.session.signupError = "Email already exists!"
      res.redirect('/signup')
    }
  })
})

router.post('/login', (req,res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginErr = "Invalid username or password"
      res.redirect('/login')
    }
  })
  
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})
module.exports = router;
