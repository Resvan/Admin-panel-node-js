const { response } = require('express');
var express = require('express');
var router = express.Router();
var adminHelpers = require('../helpers/admin-helpers')
/* GET users listing. */
router.get('/', function (req, res, next) {
  adminHelpers.getAllUsers().then((users) => {
    let admin = req.session.admin
    if (admin) {
      res.render('admin/view-user', { admin: true, users})
    } else {
      res.redirect('/admin/admin-login')
    }
  })
  
});

router.get('/admin-signup', (req, res) => {
  res.render('admin/admin-signup',{admin: true})
})

router.post('/admin-signup', (req, res) => {
  adminHelpers.doSignp(req.body).then((response) => {
    if (response) {
      res.redirect('/admin/admin-login')
    } else {
      req.session.signupError = "Email already exists!"
      res.redirect('/admin/admin-signup')
    }
  })
})

router.get('/admin-login', (req, res) => {
  let admin = req.session.admin
  if (admin) {
    res.redirect('/admin')
  } else {
    res.render('admin/admin-login', {admin:true, "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }
  
})

router.post('/admin-login', (req, res) => {
  adminHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.admin = response.admin
      res.redirect('/admin')
    } else {
      req.session.loginErr = "Invalid email or password"
      res.redirect('/admin/admin-login')
      }
    })
})




// GET to add users
router.get('/add-user',function (req,res) {
  res.render('admin/add-user', { addUserError: req.session.addUserError, admin:true })
  addUserError = false
})

// Post Added user details
router.post('/add-user', (req, res) => {
  adminHelpers.addUser(req.body).then((response) => {
    if (response) {
      res.redirect('/admin')
    } else {
      req.session.addUserError = "Email already exists"
      res.redirect('/admin/add-user')
    }
    
  })
})

router.get('/delete-user/:id', (req, res) => {
  let userId = req.params.id
  adminHelpers.deleteUser(userId).then((response) => {
    res.redirect('/admin')
  })
})

router.get('/edit-user/:id', (req, res) => {
  let userId = req.params.id
  adminHelpers.getUser(userId).then((user) => {
    res.render('admin/edit-user', { admin: true, user })
    editUserError = false
  })
})

router.post('/edit-user', (req, res) => {
  adminHelpers.editUser(req.body).then((response) => {
      res.redirect('/admin')
  })
})

router.get('/add-admin', (req, res) => {
  res.render('admin/add-admin', { admin: true, addAdminError: req.session.addAdminError })
  addAdminError = false
})

router.post('/add-admin', (req, res) => {
  adminHelpers.addAdmin(req.body).then((response) => {
    if (response) {
      res.redirect('/admin')
    } else {
      req.session.addAdminError = 'Email already exisits'
      res.redirect('/admin/add-admin')
    }
    
  })
})

router.get('/admin-logout', (req, res) => {
  req.session.destroy()
  res.redirect('/admin')
})


module.exports = router;
