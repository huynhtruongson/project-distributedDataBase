module.exports.logout = (req,res) => {
  res.clearCookie('username')
  res.clearCookie('password')
  res.clearCookie('server')
  res.redirect('/login')
}