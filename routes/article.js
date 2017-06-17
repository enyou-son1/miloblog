let express = require('express');
let router = express.Router();
let Article = require('../model').Article;
let Category = require('../model').Category;
let Comment = require('../model').Comment;
let middleware = require('../middleware');
router.get('/add', middleware.checkLogin, function(req,res){
  Category.find({},function(err,categories){
      res.render('article/add',{title:'发表文章',categories,article:{}});
  });
});
router.post('/add', middleware.checkLogin, function(req,res){
    let article = req.body;
    //文章的作者等于会话中用户对象的_id属性
    article.user = req.session.user._id;
    Article.create(article,function(err,doc){
        if(err){
            res.redirect('back');
        }else{
            res.redirect('/');
        }
    });
});
router.get('/detail/:_id',function(req,res){
    Article.update({_id:req.params._id},{$inc:{pageView:1}},function (err,result){
        //根据文章的ID查询文章的对象并且渲染到页面中
        Article.findById(req.params._id)
        .populate('category') //把分类ID变成分类对象
        .populate('user')     //把用户ID变成用户对象
        .exec(function (err, article) {
            Comment.find({article:req.params._id}).sort({createAt:-1}).populate('user').exec((err, comments)=>{
                let idPidArr = {};
                let commentArr = {};
                comments.forEach(function (comment) {
                    commentArr[comment._id] = comment;
                    if(comment.commentId === undefined){
                        idPidArr[comment._id] = 0;
                    }else{
                        idPidArr[comment._id] = comment.commentId;
                    }
                });
                console.log(idPidArr);
                console.log(commentArr);
                res.render('article/detail',{title:'文章详情',article,comments,idPidArr,commentArr});
            });
        })
    });
});
router.get('/delete/:_id', middleware.checkLogin, function(req,res){
  Article.remove({_id:req.params._id},function(err,result){
     if(err){
          res.redirect('back');
     }else{
         res.redirect('/');
     }
  });
});

router.get('/update/:_id', middleware.checkLogin, function(req,res){
  Article.findById(req.params._id).exec(function(err,article){
    Category.find({},function(err,categories){
       res.render('article/add',{title:'更新文章',article,categories});
    });
  });
});
router.post('/update/:_id', middleware.checkLogin, function(req,res){
  let _id = req.params._id;
  let article = req.body;
  Article.update({_id},article,function(err,result){
    if(err){
        res.redirect('back');
    }else{
        res.redirect(`/article/detail/${_id}`);
    }
  });
});


module.exports = router;
// <%if(user

// user 模板里的一个变量
// 这个变量从渲染模板的数据对象中取值的
// 这个数据对象 res.locals
// res.locals.user 是从会话对象中取的 req.session.user
// req.session.user是在登录成功之后把查找的用户对象传给req.session的