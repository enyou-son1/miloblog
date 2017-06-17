let express = require('express');
let router = express.Router();
let Article = require('../model').Article;
let Comment = require('../model').Comment;

router.post('/add', (req, res)=>{
    let comment = req.body;
    comment.user = req.session.user._id;
    Comment.create(comment, (err, doc)=>{
        if(err){
            res.redirect('back');
        }else{
            Article.update({_id:comment.article}, {$inc:{commentCnt:1}}, (err, result)=>{
                res.redirect(`/article/detail/${comment.article}`);
            });
        }
    });
});

router.post('/reply', (req, res)=>{
    let comment = req.body;
    comment.user = req.session.user._id;
    Comment.create(comment, (err, doc)=>{
        if(err){
            res.redirect('back');
        }else{
            Article.update({_id:comment.article}, {$inc:{commentCnt:1}}, (err, result)=>{
                res.redirect(`/article/detail/${comment.article}`);
            });
        }
    });
});

module.exports = router;

// user 模板里的一个变量
// 这个变量从渲染模板的数据对象中取值的
// 这个数据对象 res.locals
// res.locals.user 是从会话对象中取的 req.session.user
// req.session.user是在登录成功之后把查找的用户对象传给req.session的