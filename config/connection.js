const mongoClient = require('mongodb').MongoClient

const state = {
    db: null
}

module.exports.connect = function (done) {
    const url = 'mongodb://localhost:27017'
    const dbname = 'usersDB'

    mongoClient.connect(url, (err, data) => {
        if (err) return done(err);
        state.db = data.db(dbname)
        done();
    })
}

module.exports.get = function () {
    return state.db
}

//////////////////////////////////////////////////////////////////

// const {MongoClient} = require('mongodb');

// const url = 'mongodb://localhost:27017'
// const client = new MongoClient(url);

// const dbname='users';
// const state = {
//     db: null
// }
// module.exports.connect = async function(done){

//     try{
//         await client.connect();
//         state.db = client.db(dbname);
//         // console.log("database connected")
//         done();
//     }finally{
//         await client.close();
//     }
// }


// module.exports.get = function(){
//     return client.db
// }

