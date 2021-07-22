const express = require('express');
const router = express.Router({ mergeParams: true});
const catchAsync = require('../utility/catchAsync');
const {validateBlog} = require('../middleware');
const ExpressError = require('../utility/ExpressError');

const Bloger = require('../models/bloger');
const Blog = require('../models/blog');

router.get('/', catchAsync( async function(req, res) {
    const bloger = await Bloger.findOne({blogername: req.params.blogername}).populate('blogs', 'title content');
    if(!bloger){
        throw new ExpressError(400, 'Bloger not found.');
    }
    res.render('bloger/dashboard', { bloger });
}));

router.get('/compose', catchAsync( async function(req, res) {
    const bloger = await Bloger.findOne({blogername:req.params.blogername});
    if(!bloger){
        throw new ExpressError(400, 'Bloger not found.');
    }
    res.render('bloger/compose', { bloger });
}));

router.post('/compose', validateBlog, catchAsync( async function(req, res) {
    const bloger = await Bloger.findOne({blogername:req.params.blogername});
    if(!bloger){
        throw new ExpressError(400, 'Bloger not found.');
    }
    const blog = new Blog(req.body.blog);
    blog.bloger = bloger;
    bloger.blogs.push(blog);
    await blog.save();
    await bloger.save();
    res.redirect(`/bloger/${bloger.blogername}`);
}));

router.get('/:title', catchAsync( async function(req, res) {
    const { blogername, title } = req.params;
    // Got to find a better logic to do next two step in one line. I know it can be done but don't know how.
    const bloger = await Bloger.findOne({blogername: blogername});
    if(!bloger){
        throw new ExpressError(400, 'Bloger not found.');
    }
    const blog = await Blog.findOne({title: title, bloger: bloger._id}).populate('bloger','blogername');
    if(!blog) {
        throw new ExpressError(400, 'Blog not found.');
    }
    res.render('bloger/blog', { blog });
}));

router.delete('/:title', catchAsync( async function(req, res) {
    const { blogername, title } = req.params;
    const bloger = await Bloger.findOne({blogername: blogername});
    if(!bloger){
        throw new ExpressError(400, 'Bloger not found.');
    }
    const blog = await Blog.findOne({ title: title, bloger: bloger._id } ).populate('bloger', 'blogername');
    if(!blog) {
        throw new ExpressError(400, 'Blog not found.');
    }
    await bloger.update({$pull: {blogs: blog._id}});
    await blog.delete();
    res.redirect(`/bloger/${bloger.blogername}`);
}));

router.get('/:title/edit', catchAsync( async function(req, res) {
    const { blogername, title } = req.params;
    const bloger = await Bloger.findOne({blogername: blogername});
    if(!bloger){
        throw new ExpressError(400, 'Bloger not found.');
    }
    const blog = await Blog.findOne({title: title, bloger: bloger._id}).populate('bloger', 'blogername');
    if(!blog) {
        throw new ExpressError(400, 'Blog not found.');
    }
    res.render('bloger/edit', { blog });
}));

router.put('/:title', validateBlog, catchAsync( async function(req, res) {
    const { title, content } = req.body.blog;
    const bloger = await Bloger.findOne({blogername: req.params.blogername});
    if(!bloger){
        throw new ExpressError(400, 'Bloger not found.');
    }
    const blog = await Blog.findOneAndUpdate({title: req.params.title, bloger: bloger._id}, {title: title, content: content}).populate('bloger', 'blogername');
    if(!blog) {
        throw new ExpressError(400, 'Blog not found.');
    }
    res.redirect(`/bloger/${blog.bloger.blogername}`);
}));

module.exports = router;