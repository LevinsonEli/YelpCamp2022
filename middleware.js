const Campground = require('./models/campground');
const ExpressError = require('./utils2/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', "You must sign in");
        return res.redirect('/login');
    }
    return next();
}

module.exports.validateCampground = (req, res, next) => {
    console.log(req.body);
    const validationResult = campgroundSchema.validate(req.body);
    if (validationResult.error) {
        console.log(validationResult)
        const errorMessage = validationResult.error.details.map(elem => elem.message).join(', ');
        throw new ExpressError(errorMessage, 400);
    }
    console.log(validationResult);

    return next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!req.user || !review.author.equals(req.user._id)) {
        req.flash('error', 'You do not a permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    } else {
        return next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const curCampgroundId = req.params.id;
    const curCampground = await Campground.findById(curCampgroundId);
    if (!req.user || !curCampground.author.equals(req.user._id)) {
        req.flash('error', 'You do not a permission to do that');
        return res.redirect(`/campgrounds/${curCampgroundId}`);
    } else {
        return next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const validationResult = reviewSchema.validate(req.body);
    //console.log(validationResult);

    if (validationResult.error) {
        const curCampgroundId = req.params.id;
        const errorMessage = validationResult.error.details.map(elem => elem.message).join(', ');
        
        req.flash('error', errorMessage);
        return res.redirect(`/campgrounds/${curCampgroundId}`);
    }
    else {
        return next();
    }
}
