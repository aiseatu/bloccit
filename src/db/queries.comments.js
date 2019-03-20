const Comment = require("./models").Comment;
const Post = require("./models").Post;
const User = require("./models").User;

const Authorizer = require("../policies/comment");

module.exports = {

  createComment(newComment, callback){
    return Comment.create(newComment)
    .then((comment) => {
      callback(null, comment);
    })
    .catch((err) => {
      callback(err);
    });
  },

  deleteComment(req, callback){
    return Comment.findById(req.params.id)
    .then((comment) => {
      const authorized = new Authorizer(req.user, comment).destroy();

      if(authorized){
        // console.log("DEBUG: queries.post.js #deletePost SUCCESS");
        // console.log(authorized);
        // console.log("------------\n\n");
        comment.destroy();
        callback(null, comment);
      } else {
        // console.log("DEBUG: queries.post.js #deletePost FAIL");
        // console.log(authorized);
        // console.log("------------\n\n");
        req.flash("notice", "You are not authorized to do that.");
        callback(401);
      }
    })
    .catch((err) => {
      console.log(err);
      done();
    })
  }
}
