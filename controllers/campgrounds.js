const Campgrounds = require('../views/models/campground');
const {cloudinary} = require('../cloudinary/index')


module.exports.index = async(req,res)=>{
    const campgrounds = await Campgrounds.find({})
    res.render('campgrounds/index', {campgrounds})
}
module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new')
}
module.exports.createCampground = async (req,res,next)=>{
    //if(!req.body.campground) throw new ExpressError('Invalid Campgrounds Data',400)
    const campground = new Campgrounds(req.body.campground);
    campground.images =  req.files.map(f => ({url:f.path, filename:f.filename}))
    campground.author = req.user._id
    await campground.save()
    console.log(campground)
    req.flash('success', 'Successfully made a new Campgrounds!')
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.showCampground = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campgrounds.findById(id).populate({
            path:'reviews',
            populate:{
                path:'author'
            }
    }).populate('author');
    console.log(campground)
    if(!campground){
        req.flash('error', 'Cannot find that Campgrounds!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}

module.exports.renderEditForm = async(req,res)=>{ 
    const {id} = req.params;
    const campground = await Campgrounds.findById(id)
    if(!campground){
        req.flash("error", 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }  
    res.render('campgrounds/edit', {campground})
}
module.exports.deleteCampground = async(req,res)=>{
    const {id} = req.params;

    const deletedcamp = await Campgrounds.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted Campgrounds')
    res.redirect('/campgrounds')
}
module.exports.updateCampground = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campgrounds.findByIdAndUpdate(id, {... req.body.campground})
    const imgs = req.files.map(f => ({url:f.path, filename:f.filename}))
    campground.images.push(...imgs)
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull :{images: {filename:{$in: req.body.deleteImages}}}})
        console.log(campground)
    }
    campground.save()
   req.flash('success', 'Successfully updated Campgrounds!')
   res.redirect(`/campgrounds/${campground._id}`)
}