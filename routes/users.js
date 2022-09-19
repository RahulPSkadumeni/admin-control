var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers')


/* GET users listing. */

router.get('/', notLoggedInChecker, function (req, res, next) {
  let user = req.session.user;
  let products = [{
    firstName: "nice",
    lastName: "place",
    image: "https://cdn.wallpapersafari.com/12/22/koxOYv.jpg"
  },
  {
    firstName: "good",
    lastName: "place",
    image: "https://mdbcdn.b-cdn.net/img/new/standard/nature/111.webp"
  }]
  
  res.render('./users/home', {products, user:true, user});
});

router.get('/signup', loggedInChecker, (req, res, next) => {
  res.render('./users/signup')
})

router.get('/login', (req, res, next) => {
  if(req.session.userLoggedIn){
    res.redirect('/')
  }else{
    res.render('./users/login', {loginErr: req.session.loginErr})
    req.session.loginErr= false;
  }
})

router.get('/logout', (req, res)=>{
  req.session.user=null;
  req.session.userLoggedIn = false;
  res.redirect('/login')
})

//////////////////////////////////////////////////////////

router.post('/signup',verifySignup, (req, res)=>{
  userHelpers.doSignup(req.body).then((data)=>{    
    res.redirect('/login')
    console.log(data);
  }).catch(err=>{
    if(err) throw err;
    // res.redirect('/signup')
  })
})

router.post('/login',  (req, res)=>{
  userHelpers.doLogin(req.body).then(response=>{
    if(response.status){
      req.session.userLoggedIn = true;
      req.session.user = response.user;
      console.log(req.session)
      res.redirect('/');
    }else{
      req.session.loginErr = "Invalid user or password"
      res.redirect('/login')
    }
  })
})

function verifySignup(req, res, next){
  userHelpers.doVerifySignup(req.body).then(verify=>{
    if(verify){
      res.render('./users/signup', {verify: true});
      // res.redirect('/signup')
  }else{
    // res.redirect('/login')
    next();
  }
  })
}

function loggedInChecker(req, res, next){
  if(req.session.userLoggedIn===true){
    res.redirect('/')
  }
  next();
}

function notLoggedInChecker(req, res, next){
    if(req.session.userLoggedIn===false){
      res.redirect('/login')
    }
    next();
}


module.exports = router;

