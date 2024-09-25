const mongoose = require('mongoose')

const imageShema = new mongoose.Schema({
    imagePath:{
        type:String,
        requird:true
    }
})
const Image = mongoose.model("Image",imageShema);
module.exports = Image;