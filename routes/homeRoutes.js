/*
login
signup
about
/home

*/
const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync');
const passport = require('passport');

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

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), function(req, res) {
    res.redirect(`/bloger/${req.body.blogername}`);
});

router.get("/signup", async function(req, res){
    res.render('basic/signup');
});

router.post("/signup", catchAsync(async function(req, res, next) {
    const { blogername, password, fname, lname, repassword } = req.body;
    if(password!==repassword) {
        req.flash('error', 'Re-enter the same password again');
        return res.redirect('/signup');
    }
    const bloger = new Bloger({blogername, fname, lname});
    const registeredBloger = await Bloger.register(bloger, password);
    req.login(registeredBloger, function(err) {
        if(err) {
            next(err);
        } else {
            res.redirect(`/bloger/${req.body.blogername}`);
        }
    })
}));

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Logged Out');
    res.redirect('/');
})

router.get("/about", async function(req, res){
    res.render('basic/about');
});

module.exports = router;