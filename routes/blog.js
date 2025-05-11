const { Router } = require('express');
const Blog = require('../models/blog');
const router = Router();
const multer = require('multer');
const path = require('path');
const Comment = require('../models/comment');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/uploads'));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage })

router.get('/add', (req, res) => {
    res.render('addBlog', {
        user: req.user
    });
});

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');
    console.log('check id====', req.params.id, blog, comments);
    return res.render('blog', {
        blog,
        comments,
        user: req.user
    })

});

router.post('/add', upload.single('coverImgUrl'), (req, res) => {
    const { title, body, coverImgUrl } = req.body;
    Blog.create({
        title,
        body,
        coverImgUrl: '/uploads/' + req.file.filename,
        createdBy: req.user._id
    });

    return res.redirect('/');
});

router.post('/comment/:blogId', async (req, res) => {
    const { content } = req.body;
    await Comment.create({
        content,
        createdBy: req.user._id,
        blogId: req.params.blogId
    });

    return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;