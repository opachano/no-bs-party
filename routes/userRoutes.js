const express     = require("express");
const router      = express.Router();
const User        = require("../models/User");
const bcrypt      = require("bcryptjs");
const passport    = require("passport");
const uploadCloud = require("../config/cloudinary.js");

router.get("/signup", (req, res, next) => {
  res.render("users/signup", {message: req.flash("error")});
});

router.post("/signup", uploadCloud.single("image"), (req, res, next) => {
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
        const newUser = req.body;
        if(req.file) {newUser.image = req.file.url;}
        User.create(newUser)
        .then((newUser)=>{
            req.login(newUser, (err) => {
              if(err) {
                req.flash("error", "Couldn't create the user, please try again later.");
                res.redirect("/user/signup");
                return
              }
              res.redirect(`/user/${newUser._id}/profile`);
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
    user.date = user.createdAt.toLocaleDateString("en-US");
    res.render("users/profile", {user})
  })
  .catch((err)=>{
    next(err);
  })
})

router.get("/:id/edit", (req, res, next) => {
  User.findById(req.params.id)
  .then((user)=>{
    if(!req.user._id.equals(user._id)){
      req.logout();
      req.flash("error", "Tried to access incorrect profile, please log in and try again.")
      res.redirect("/user/login");
      return
    }
    user.date = user.createdAt.toLocaleDateString("en-US");
    res.render("users/editProfile", {user})
  })
  .catch((err)=>{
    next(err);
  })
})

router.post("/:id/edit", uploadCloud.single("image"), (req, res, next) => {
  const updatedUser = req.body;
  if(req.file) {updatedUser.image = req.file.url;}
  User.findByIdAndUpdate(req.params.id, updatedUser)
  .then((user)=>{
    res.redirect(`/user/${user._id}/profile`);
  })
  .catch((err)=>{
    next(err)
  })
})

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("logout", "You have been successfully logged out.");
  res.redirect("/");
});

module.exports = router;
