const multer = require("multer");
const path = require("path");
const util = require("util")

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: function (req,file,cb){
        cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
})

function checkFileType(file,cb){
    const filetypes = /jpeg|jpg|png|gif|mp4|mov/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(extname && mimetype){
        return cb(null, true);
    }else{
        cb(new Error('Error: Format unmatched'));
    }
}


const upload = multer({
    storage:storage,
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    },
}).array('files',5);

// function uploadMiddleware(req,res,next){
//     util.promisify(upload);
//     next()
// } 
const uploadMiddleware = util.promisify(upload)

module.exports={
 uploadMiddleware
}