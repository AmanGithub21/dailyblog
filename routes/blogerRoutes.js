const express = require('express');
const router = express.Router({ mergeParams: true});
const catchAsync = require('../utility/catchAsync');
const {validateBlog, isLoggedIn, isCurrentUser} = require('../middleware');
const ExpressError = require('../utility/ExpressError');

const Bloger = require('../models/bloger');
const Blog = require('../models/blog');
const { bulkWrite } = require('../models/bloger');

router.get('/', isLoggedIn, isCurrentUser, catchAsync( async function(req, res) {
    const bloger = await Bloger.findOne({blogername: req.params.blogername}).populate('blogs', 'title content');
    const ealert = req.session.noBlog;
    delete req.session.noBlog;
    return res.render('bloger/dashboard', { bloger, ealert });
}));

router.get('/compose', isLoggedIn, isCurrentUser, catchAsync( async function(req, res) {
    const bloger = req.user;
    res.render('bloger/compose', { bloger });
}));

router.post('/compose', isLoggedIn, isCurrentUser, validateBlog, catchAsync( async function(req, res) {
    const bloger = await Bloger.findById(req.user._id).populate('blogs');
    const blog = new Blog(req.body.blog);
    const result = bloger.blogs.find( ({ title }) => title === blog.title );
    if(result) {
        req.flash('error', 'You have already used the title in another post. Try with a different title');
        return res.redirect(`/bloger/${bloger.blogername}`);
    }
    blog.bloger = bloger;
    bloger.blogs.push(blog);
    await blog.save();
    await bloger.save();
    req.flash('success', 'Successfully posted the blog.');
    res.redirect(`/bloger/${bloger.blogername}`);
}));

router.get('/:title', isLoggedIn, isCurrentUser, catchAsync( async function(req, res) {
    const { title } = req.params;
    // though i can also find in req.user and populate. May be I will do it later.
    const blog = await Blog.findOne({title: title, bloger: req.user._id}).populate('bloger','blogername');
    if(!blog) {
        throw new ExpressError(400, 'Blog not found.');
    }
    res.render('bloger/blog', { blog });
}));

router.delete('/:title', isLoggedIn, isCurrentUser, catchAsync( async function(req, res) {
    const { title } = req.params;
    const bloger = req.user;
    const blog = await Blog.findOne({ title: title, bloger: bloger._id } ).populate('bloger', 'blogername');
    if(!blog) {
        throw new ExpressError(400, 'Blog not found.');
    }
    await bloger.update({$pull: {blogs: blog._id}});
    await blog.delete();
    res.redirect(`/bloger/${bloger.blogername}`);
}));

router.get('/:title/edit', isLoggedIn, isCurrentUser, catchAsync( async function(req, res) {
    const { title } = req.params;
    const blog = await Blog.findOne({title: title, bloger: req.user._id}).populate('bloger', 'blogername');
    if(!blog) {
        throw new ExpressError(400, 'Blog not found.');
    }
    res.render('bloger/edit', { blog });
}));

router.put('/:title', isLoggedIn, isCurrentUser, validateBlog, catchAsync( async function(req, res) {
    const { content } = req.body.blog;
    const newBlogTitle = req.body.blog.title;
    const bloger = await Bloger.findById(req.user._id).populate('blogs');
    const blog = await Blog.findOne({title: req.params.title, bloger: bloger._id});
    const result = bloger.blogs.find( ({ title }) => title == newBlogTitle );
    if(result) {
        req.flash('error', 'You have already used the title in another post. Try with a different title');
        return res.redirect(`/bloger/${bloger.blogername}`);
    }
    await blog.update({title: title, content: content});
    res.redirect(`/bloger/${bloger.blogername}`);
}));

module.exports = router;