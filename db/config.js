const mongoose = require('mongoose');

const dbConnection = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_CNN,{});
        console.log('la base de datos esta ready');
    }catch(e){
        throw new Error('Error al conectar a la base de datos', e)
    }
}

module.exports = {
    dbConnection
}