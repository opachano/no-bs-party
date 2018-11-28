const express    = require("express");
const router     = express.Router();
const User       = require("../models/User");
const bcrypt     = require("bcryptjs");
const passport   = require("passport");

router.get("/signup", (req, res, next) => {
  res.render("users/signup", {message: req.flash("error")});
});

router.post("/signup", (req, res, next) => {
  if(req.body.password !== req.body.confirmPassword) {
    req.flash("error", "Password do not match")
    res.redirect("/user/signup");
    return
  }
  User.findOne({username: req.body.username})
  .then((user)=>{
    if(user !== null) {
      req.flash("error", "Username taken")
      res.redirect("/user/signup");
     return;
    }
    User.findOne({email: req.body.email})
    .then((user)=>{
      if(user !== null) {
        req.flash("error", "Email already in use")
        res.redirect("/user/signup");
        return;
        }
        const salt     = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hashPass;
        User.create(req.body)
        .then((newUser)=>{
            req.login(newUser, (err) => {
              if(err) {
                req.flash("error", "Couldn't create the user, please try again later.");
                res.redirect("/user/signup");
                return
              }
              res.redirect(`/user/${req.user._id}/profile`);
            });
        })
        .catch((err)=>{
            next(err);
        });
    })
    .catch((err)=>{
      next(err);
    });
  })
  .catch((err)=>{
    next(err)
  })
})

router.get("/login", (req, res, next)=>{
  res.render("users/login", {message: req.flash("error")})
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/user/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/:id/profile", (req, res, next) => {
  User.findById(req.params.id).populate("posts")
  .then((user)=>{
    if(!req.user._id.equals(user._id)){
      req.logout();
      req.flash("error", "Tried to access incorrect profile, please log in and try again.")
      res.redirect("/user/login");
      return
    }
    res.render("users/profile", {user})
  })
  .catch((err)=>{
    next(err);
  })
})

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("logout", "You have been successfully logged out.");
  res.redirect("/");
});

module.exports = router;
