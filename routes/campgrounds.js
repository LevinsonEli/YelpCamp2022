const express = require('express');
const router = express.Router();
const catchAsync = require('../utils2/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(upload.array('images'), isLoggedIn, validateCampground, catchAsync(campgrounds.createNew))

router.get('/new', isLoggedIn, catchAsync(campgrounds.renderNewForm));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.route('/:id')
    .get(catchAsync(campgrounds.showOne))
    .patch(isLoggedIn, isAuthor, upload.array('images'), validateCampground, catchAsync(campgrounds.updateOne))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteOne))

module.exports = router;
