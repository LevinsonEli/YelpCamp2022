const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils2/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');

router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createOne))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteOne))

module.exports = router;