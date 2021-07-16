const express = require('express');
const router = express.Router();
const Globalblog = require('../models/globalBlog');

router.get('/', async function(req, res) {
    const blogs = await Globalblog.find({});
    res.render('global/home', { blogs });
});

//Creating new blogs
router.post('/', async function(req, res) {
    const blog = new Globalblog(req.body);
    blog.save();
    res.redirect('global');
});

router.get('/new', function(req, res) {
    res.render('global/new');
});

router.get('/:title', async function(req, res) {
    const blog = await Globalblog.findOne({title: req.params.title});
    res.render('global/blog', { blog });
});

router.get('/:title/edit', async function(req, res) {
    const blog = await Globalblog.findOne({title: req.params.title});
    res.render('global/edit', { blog });
});

//Editing a blog.
router.put('/:title', async function(req, res) {
    const { title, content} = req.body;
    console.log(`{title: ${title}, content: ${content}}`);
    await Globalblog.findOneAndUpdate({title: req.params.title}, {title: title, content: content});
    // console.log("ASDASDASD\n", blog); //here title in blog should be changed but it is still showing the same.
    res.redirect(`/global/${title}`);
});

router.delete('/:title', async function(req, res) {
    const { title } = req.params;
    await Globalblog.findOneAndDelete({title: title});
    res.redirect('/global');
});

module.exports = router;