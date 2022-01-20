const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    return res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = async (req, res, next) => {
    return res.render('campgrounds/new');
}

module.exports.createNew = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({ 
        query: req.body.campground.location,
        limit: 1
    }).send();
    
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    console.log(campground.images);
    campground.geometry = geoData.body.features[0].geometry;
    await campground.save();
    //console.log(campground);
    req.flash('success', 'Successfully created a new campground');
    return res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.renderEditForm = async (req, res, next) => {
    const curCampgroundId = req.params.id;
    const campground = await Campground.findById(curCampgroundId);
    
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    
    return res.render('campgrounds/edit', { campground });
}

module.exports.showOne = async (req, res, next) => {
    const campground = await Campground
        .findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    //console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        res.redirect('/campgrounds');
    }
    return res.render('campgrounds/show', { campground });
}

module.exports.updateOne = async (req, res, next) => {
    const curCampgroundId = req.params.id;
    console.log(req.body);
    const recievedCampground = { ...req.body.campground };
    const updatedCampground = await Campground.findByIdAndUpdate(curCampgroundId, recievedCampground, { new: true });
    
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    updatedCampground.images.push(...images);
    await updatedCampground.save();

    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await updatedCampground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages } } } });
        console.log(updatedCampground);
    }
    req.flash('success', 'Successfully updated the campground')
    return res.redirect(`/campgrounds/${updatedCampground._id}`);
}

module.exports.deleteOne = async (req, res, next) => {
    const curCampgroundId = req.params.id;
    const deletedCampground = await Campground.findByIdAndDelete(curCampgroundId);
    req.flash('success', 'Successfully deleted the campground')
    return res.redirect('/campgrounds');
}