if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const mongoose = require('mongoose')
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.y13yezm.mongodb.net/noh`;

module.exports.connectDB = async () => {
   
    try {
        await mongoose.connect(uri)
            // , { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to database');
    } catch (error) {
        console.error('Couldn\'t Connect To Database: ', error);
        process.exit(1); // Exit process with failure
    }
};


