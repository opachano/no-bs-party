const express = require("express");
const router  = express.Router();

router.get("/", (req, res, next) => {

  res.render("index", {message: req.flash("error"), logout: req.flash("logout")});
});

module.exports = router;
