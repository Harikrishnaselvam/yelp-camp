const baseJoi = require('joi')
const sanitizeHtml = require('sanitize-html')

const extension = (joi) =>({
    type:'string',
    base: joi.string(),
    messages:{
        'string.escapeHtml':'{{#label}} must not include HTML!'
    },
    rules:{
        escapeHtml:{
            validate(value, helpers){
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttribiutes:{},
                })
                if(clean !== value) return helpers.error('string.escapeHtml', {value});
                return clean
            }
        }
    }
})

const Joi = baseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHtml(),
        price: Joi.number().required().min(0),
        location: Joi.string().required().escapeHtml(),
        description: Joi.string().required().escapeHtml()
    }).required(),
    deleteImages: Joi.array()
})
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body:Joi.string().required().escapeHtml()
    }).required()
})