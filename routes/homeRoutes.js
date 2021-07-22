/*
login
signup
about
/home

*/
const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync');

const Bloger = require('../models/bloger');

router.get("/",async function(req, res){
    res.render('basic/home');
});

router.get('/about', function(req, res) {
    res.render('basic/about');
});

router.get("/login",async function(req, res){
    res.render('basic/login');
});

router.post('/login',async function(req, res) {
    const { blogername, password} = req.body;
    const bloger = await Bloger.findOne({blogername: blogername});
    if(bloger) {
        if(bloger.password==password) {
            res.redirect(`/bloger/${blogername}`);
        } else {
            res.send('Wrong Password');
        }
    } else {
        res.send('No Bloger Found');
    }
})

router.get("/signup",async function(req, res){
    res.render('basic/signup');
});

router.post("/signup",catchAsync(async function(req, res) {
    const bloger = new Bloger(req.body);
    await bloger.save();
    console.log(bloger);
    res.redirect(`/bloger/${req.body.blogername}`);
}));

router.get("/about",async function(req, res){
    res.render('basic/about');
});

module.exports = router;