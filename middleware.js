const { blogSchema } = require('./joiSchema');
const ExpressError = require('./utility/ExpressError');

module.exports.validateBlog = function(req, res, next) {
    const {error} =  blogSchema.validate(req.body);
    if(error) {
        // console.log('\n\n\bERROR', error);
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}