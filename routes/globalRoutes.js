const express = require('express');
const router = express.Router();
const Globalblog = require('../models/globalBlog');
const catchAsync = require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const {validateBlog} = require('../middleware');


router.get('/',catchAsync( async function(req, res) {
    const blogs = await Globalblog.find({});
    res.render('global/home', { blogs });
}));

//Creating new blogs
router.post('/', validateBlog, catchAsync( async function(req, res) {
    const b = await Globalblog.findOne({ title: req.body.blog.title });
    if(b) {
        return res.send('Already found a Global blog with this title. Can you please use another title. Thank you');
    }
    const blog = new Globalblog(req.body.blog);
    await blog.save();
    res.redirect('global');
}));

router.get('/new', function(req, res) {
    res.render('global/new');
});

router.get('/:title', catchAsync( async function(req, res) {
    const blog = await Globalblog.findOne({title: req.params.title});
    if(!blog) {
        throw new ExpressError(404, 'Blog Not Found');
    }
    res.render('global/blog', { blog });
}));

router.get('/:title/edit', catchAsync( async function(req, res) {
    const blog = await Globalblog.findOne({title: req.params.title});
    if(!blog) {
        throw new ExpressError(404, 'Blog Not Found');
    }
    res.render('global/edit', { blog });
}));

//Editing a blog.
router.put('/:title', validateBlog, catchAsync(async function(req, res) {
    const { title, content} = req.body.blog;
    const b = await Globalblog.find({ title: req.body.blog.title });
    if(b.length!=0) {
        return res.send('Already found a Global blog with this title. Can you please use another title. Thank you');
    }
    await Globalblog.findOneAndUpdate({title: req.params.title}, {title: title, content: content});
    res.redirect(`/global/${title}`);
}));

router.delete('/:title', catchAsync(async function(req, res) {
    const { title } = req.params;
    const blog = await Globalblog.findOneAndDelete({title: title});
    if(!blog) {
        throw new ExpressError(400, "BLOG NOT FOUND.");
    }
    res.redirect('/global');
}));

module.exports = router;