const express = require('express');
const router = express.Router({ mergeParams: true});

const Bloger = require('../models/bloger');
const Blog = require('../models/blog');

router.get('/',async function(req, res) {
    const bloger = await Bloger.findOne({blogername: req.params.blogername}).populate('blogs');
    console.log(bloger);
    res.render('bloger/dashboard', { bloger });
});

router.get('/compose', async function(req, res) {
    const bloger = await Bloger.findOne({blogername:req.params.blogername});
    res.render('bloger/compose', { bloger });
});

router.post('/compose', async function(req, res) {
    const blog = new Blog(req.body.blog);
    const bloger = await Bloger.findOne({blogername:req.params.blogername});
    blog.bloger = bloger;
    bloger.blogs.push(blog);
    await blog.save();
    await bloger.save();
    res.redirect(`/bloger/${bloger.blogername}`);
});

router.get('/:title', async function(req, res) {
    const blog = await Blog.findOne({title:req.params.title}).populate('bloger','blogername');
    res.render('bloger/blog', { blog });
});

router.delete('/:title', async function(req, res) {
    const blog = await Blog.findOneAndDelete({title: req.params.title}).populate('bloger');
    res.redirect(`/bloger/${blog.bloger.blogername}`);
});

router.get('/:title/edit', async function(req, res) {
    const blog = await Blog.findOne({title: req.params.title}).populate('bloger', 'blogername');
    res.render('bloger/edit', { blog });
});

router.put('/:title', async function(req, res) {
    const { title, content } = req.body.blog;
    const blog = await Blog.findOneAndUpdate({title: req.params.title}, {title: title, content: content}).populate('bloger', 'blogername');
    console.log(blog);
    res.redirect(`/bloger/${blog.bloger.blogername}`);
});

module.exports = router;