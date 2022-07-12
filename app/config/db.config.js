require('dotenv').config();

module.exports = {
  URL:'mongodb+srv://'+process.env.uname+':'+process.env.password+'@cluster0.upkgk.mongodb.net/?retryWrites=true&w=majority'
};