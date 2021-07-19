const express = require('express');
const router = express.Router({ mergeParams: true});

const Bloger = require('../models/bloger');
const Blog = require('../models/blog');

router.get('/',async function(req, res) {
    const bloger = await Bloger.findOne({blogername: req.params.blogername}).populate('blogs', 'title content');
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
    const { blogername, title } = req.params;
    // Got to find a better logic to do next two step in one line. I know it can be done but don't know how.
    const bloger = await Bloger.findOne({blogername: blogername});
    const blog = await Blog.findOne({title: title, bloger: bloger._id}).populate('bloger','blogername');
    res.render('bloger/blog', { blog });
});

router.delete('/:title', async function(req, res) {
    const { blogername, title } = req.params;
    const bloger = await Bloger.findOne({blogername: blogername});
    const blog = await Blog.findOne({ title: title, bloger: bloger._id } ).populate('bloger', 'blogername');
    await bloger.update({$pull: {blogs: blog._id}});
    await blog.delete();
    res.redirect(`/bloger/${bloger.blogername}`);
});

router.get('/:title/edit', async function(req, res) {
    const { blogername, title } = req.params;
    const bloger = await Bloger.findOne({blogername: blogername});
    const blog = await Blog.findOne({title: title, bloger: bloger._id}).populate('bloger', 'blogername');
    res.render('bloger/edit', { blog });
});

router.put('/:title', async function(req, res) {
    const { title, content } = req.body.blog;
    const bloger = await Bloger.findOne({blogername: req.params.blogername});
    const blog = await Blog.findOneAndUpdate({title: req.params.title, bloger: bloger._id}, {title: title, content: content}).populate('bloger', 'blogername');
    res.redirect(`/bloger/${blog.bloger.blogername}`);
});

module.exports = router;