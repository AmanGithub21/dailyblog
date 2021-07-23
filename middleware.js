const { blogSchema } = require('./joiSchema');
const ExpressError = require('./utility/ExpressError');

module.exports.validateBlog = function(req, res, next) {
    const {error} =  blogSchema.validate(req.body);
    if(error) {
        // const msg = error.details.map(el=>el.message).join(',');
        // throw new ExpressError(400, msg);
        req.session.noBlog = true;
        req.flash('error', 'Blog validation failed');
        res.redirect(`/bloger/${req.params.blogername}`);
    } else {
        next();
    }
}

module.exports.isLoggedIn = function(req, res, next) {
    // console.log('REQ.USER' , req.user);
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isCurrentUser = function(req, res, next) {
    if(req.user.blogername !== req.params.blogername) {
        throw new ExpressError(400, 'You are not authorised to visit others page');
    }
    next();
}