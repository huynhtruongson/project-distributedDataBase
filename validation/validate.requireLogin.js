module.exports.requireLogin = (req,res,next) => {
  if(!req.cookies.username) {
      res.redirect('/login')
      return
  }
  next()
}