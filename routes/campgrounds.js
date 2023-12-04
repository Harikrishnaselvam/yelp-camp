
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError  = require('../utils/ExpressError')
const Campgrounds = require('../views/models/campground');
const {campgroundSchema} = require('../schemas.js')
const campgrounds = require('../controllers/campgrounds')
const {isLoggedIn} = require('../middleware')
const {isAuthor} = require('../middleware')
const {validateCampground} = require('../middleware')
const multer = require('multer');
const {storage} = require('../cloudinary/index')
const upload = multer({storage:storage})
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground))
router.get('/new', isLoggedIn, campgrounds.renderNewForm)
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))
    .put(isLoggedIn,isAuthor, upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
router.get('/:id/edit', isLoggedIn,isAuthor, catchAsync(campgrounds.renderEditForm))
module.exports = router;
 