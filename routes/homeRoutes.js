const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync');
const passport = require('passport');

const Bloger = require('../models/bloger');

router.get("/", function(req, res){
    res.render('basic/home');
});

router.get('/about', function(req, res) {
    res.render('basic/about');
});

router.get("/login", function(req, res){
    if(req.user) {
        req.flash('error', 'Someone is already loggedIn.');
        return res.redirect('/');
    }
    res.render('basic/login');
});

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), function(req, res) {
    res.redirect(`/bloger/${req.body.blogername}`);
});

router.get("/signup", function(req, res){
    if(req.user) {
        req.flash('error', 'Someone is already loggedIn.');
        return res.redirect('/');
    }
    res.render('basic/signup');
});

router.post("/signup", catchAsync(async function(req, res, next) {
    if(req.user) {
        req.flash('error', 'Someone is already loggedIn.');
        return res.redirect('/');
    }
    const { blogername, password, fname, lname, repassword } = req.body;
    if(password!==repassword) {
        req.flash('error', 'Re-enter the same password again');
        return res.redirect('/signup');
    }
    const bloger = new Bloger({blogername, fname, lname});
    Bloger.register(bloger, password, function(err, registeredBloger) {
        if(err) {
            req.flash('error', err.message);
            return res.redirect('/signup');
        } else {
            req.login(registeredBloger, function(err) {
                if(err) {
                    next(err);
                } else {
                    res.redirect(`/bloger/${req.body.blogername}`);
                }
            });
        }
    });
}));

router.get('/logout', function(req, res){
    if(req.user) {
        req.logout();
        req.flash('success', 'Logged Out');
        res.redirect('/');
    } else {
        req.flash('error', 'You are not even loggedIn.');
        return res.redirect('/');
    }
})

module.exports = router;