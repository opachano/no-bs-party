const express     = require("express");
const router      = express.Router();
const User       = require("../models/User");
const Post       = require("../models/Post");
const Comment     = require("../models/Comment");

router.get("/new", (req, res, next) => {
  res.render("posts/newPost", {message: req.flash("error")});
});

router.post("/new", (req, res, next)  => {
  if(!req.user) {
    req.flash("error", "You need to be logged in to post.");
    res.redirect("/user/login");
  }
  req.body.user = req.user._id;
  Post.create(req.body)
  .then((post)=>{
    User.findByIdAndUpdate(post.user, {$push: {posts: post._id}})
    .then(()=>{
      res.redirect("/post/all");
    })
    .catch((err)=>{
      next(err)
    });
  })
  .catch((err)=>{
    next(err)
  })
})

router.get("/all", (req, res, next) => {
  Post.find().populate("user").populate("comments")
  .then((posts)=>{
    posts.reverse();
    if(req.user){
      posts.forEach((post)=>{
        post.createdAt = post.createdAt.toLocaleDateString("en-US");
        if(req.user._id.equals(post.user._id)) {
          post.currentUser = true;
        }
        post.comments.forEach((comment)=>{
          if(comment.user === req.user.username) {
            comment.currentUser = true;
          }
        })
      })
    }
    posts.forEach((post)=>{
      post.date = post.createdAt.toLocaleDateString("en-US")
    })

    res.render("posts/post", {post: posts, message: req.flash("error")})
  })
  .catch((err)=>{
    next(err)
  })
})

router.get("/:id/edit",(req, res, next)=>{
  if(!req.user) {
    req.flash("error", "You need to be logged in to edit a post.");
    res.redirect("/user/login");
    return
  }
  Post.findById(req.params.id)
  .then((post)=>{
    if(!req.user._id.equals(post.user)) {
      req.flash("error", "You can only edit you own posts.");
      res.redirect("/post/all");
      return
    }
    res.render("posts/editPost", {post})
  })
  .catch((err)=>{
    next(err)
  })
})

router.post("/:id/edit", (req, res, next) => {
  Post.findByIdAndUpdate(req.params.id, req.body)
  .then(()=>{
    res.redirect("/post/all")
  })
  .catch((err)=>{
    next(err)
  })
})

router.get("/:id/details", (req, res, next) => {
  Post.findById(req.params.id)
  .then((post)=>{
    res.render("posts/detailsPost", {post})
  })
}),

router.post("/:id/delete",(req, res, next)=>{
  if(!req.user) {
    req.flash("error", "You need to be logged in to delete a post.");
    res.redirect("/user/login");
    return
  }
  Post.findById(req.params.id)
  .then((post)=>{
    if(!req.user._id.equals(post.user)) {
      req.flash("error", "You can only delete you own posts.");
      res.redirect("/post/all");
      return
    }
      post.comments.forEach((comment)=>{
        Comment.findByIdAndRemove(comment)
        .then(()=>{
        })
        .catch((err)=>{
          next(err)
        })
      })
        User.findByIdAndUpdate(req.user._id, {$pull: {posts: post._id}})
        .then(()=>{
          Post.findByIdAndDelete(req.params.id)
          .then(()=>{
          res.redirect("/post/all");
          })
          .catch((err)=>{
          next(err)
          })
        })
      .catch((err)=>{
        next(err)
      })
    })
    .catch((err)=>{
      next(err)
    })
  .catch((err)=>{
    next(err)
  })
})




module.exports = router;