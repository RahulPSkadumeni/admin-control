var express = require('express');
var router = express.Router();
var adminHelpers = require('../helpers/admin-helpers')

/* GET home page. */
// router.get('/', function(req, res, next){
// res.render('./admin/home')
// })

router.get('/', verifyAdmin, function (req, res, next) {
  let vAdmin = req.session.admin
  console.log(req.session);
    adminHelpers.getAllUsers((data)=>{
      console.log("users data displayed")
      res.render('./admin/home', {vAdmin, data, admin:true});
    })

});

router.get('/login', function(req, res, next) {
  if(req.session.adminLoggedIn){
    res.redirect('/admin')
  }else{
    res.render('./admin/login', { adminLoginErr: req.session.adminLoginErr});
    adminLoginErr = false;


  }
});

router.post('/login', (req, res)=>{

  adminHelpers.doAdminLogin(req.body).then(response=>{
    console.log(response)
    if(response.adminStatus){
      req.session.admin = response.admin;
      req.session.adminLoggedIn = true;
      res.redirect('/admin')
    }else{
      req.session.adminLoginErr = "Invalid admin"
      res.redirect('/admin/login')
    }
  })
})

router.get('/logout', (req,res)=>{
  req.session.admin = null;
  req.session.adminLoggedIn = false;
  res.redirect('/admin/login')
})

router.get('/add-user',verifyAdmin, (req, res, next)=>{
  res.render('./admin/add-user', {admin:true})
})


router.post('/add-user', verifyAddUser, (req, res, next)=>{
  console.log(req.body)
  adminHelpers.addUser(req.body).then(result=>{
    res.redirect('/admin')
    console.log(result)

  })
})

router.get('/delete/:id',(req, res)=>{  
  let userId = req.params.id;
  adminHelpers.deleteUser(userId).then(response=>{
    res.redirect('/admin');
  })
  console.log(userId)
})

router.get('/edit/:id',verifyAdmin, (req, res)=>{
  console.log(req.session)
  adminHelpers.getUserDetails(req.params.id).then(userData=>{
    console.log(userData)
    res.render('./admin/edit-user', {userData, admin:true})
  });
})

router.post('/edit/:id', (req, res)=>{
  adminHelpers.updateUser(req.params.id, req.body).then(response=>{
    res.redirect('/admin')
  })
})

function verifyAddUser(req, res, next){
  adminHelpers.doVerifySignup(req.body).then(verify=>{
    if(verify){
      res.render('./admin/add-user', {addUserVerify: true});
      // res.redirect('/signup')
  }else{
    // res.redirect('/login')
    next();
  }
  })
}

function verifyAdmin(req, res, next){
  if(req.session.adminLoggedIn ===false){
    res.redirect('/admin/login')
  }
  next();
}
module.exports = router;


