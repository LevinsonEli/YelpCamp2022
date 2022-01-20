const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createOne = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully created a new review')
    res.redirect(`/campgrounds/${ campground._id }`);
}

module.exports.deleteOne = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewId } });
    const deletedReview = await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted the review')
    res.redirect(`/campgrounds/${id}`);
}