$(document).ready(function() {
  $(".nav-link").hover(function(){$(this).toggleClass("active")} ,function(){$(this).toggleClass("active")});
  $(".alert-success").fadeTo(2000, 500).slideUp(500, function(){
    $(".alert-success").slideUp(500);
  });
  $(".alert-danger").fadeTo(2000, 500).slideUp(500, function(){
    $(".alert-danger").slideUp(500);
  });

  $(".postLike").click(function(){
    axios.post(`/post/${$(this).data("id")}/like`)
    .then((updatedPost)=>{
      const likes = updatedPost.data.likes.length;
      $(this).find("span").html(likes);
    })
    .catch((err)=>{
      console.log(err)
    })
  })

  $(".commentLike").click(function(){
    axios.post(`/comment/${$(this).data("od")}/like`)
    .then((updatedComment)=>{
      const likes = updatedComment.data.likes.length;
      $(this).find("span").html(likes);
    })
    .catch((err)=>{
      console.log(err)
    })
  })
});
