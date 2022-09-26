const cloudinary = require('cloudinary');

const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({ 
    cloud_name: 'digzd83tm', 
    api_key: '353179693789243', 
    api_secret: '8qe8hsokWJLjenmDOg0C8qmPpKY' 
  });

  exports.uploads = (file,folder)=>{
    return new Promise(resolve=>{
        cloudinary.upload(file,(result)=>{
            resolve({
                url:result.url,
                id:result.id
            })
        })
    })
  }