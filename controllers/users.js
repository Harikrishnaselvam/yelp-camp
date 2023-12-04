const Users = require('../views/models/user')

module.exports.renderRegister = (req,res)=>{
    res.render('users/register')
}
module.exports.register = async(req,res)=>{
    try {
    const {username, password, email} = req.body;
    const user = new Users({email, username})
    const registeredUser = await Users.register(user, password)
    req.login(registeredUser, function(err) {
        if (err) { return next(err); }
        req.flash('success', "Welcome to Yelp-Camp!")
        res.redirect('/campgrounds')
      })
    } catch(e){
        req.flash('error', e.message);
        res.redirect('register')
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login')
}

module.exports.login = (req,res) =>{
    req.flash('success', "Welcome Back!");
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye")
      res.redirect('/campgrounds')
      });
}