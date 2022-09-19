var db = require('../config/connection')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId

module.exports = {
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////
   // doSignup: (user, callback)=>{
    //     console.log(user)
    //     db.get().collection('user').insertOne(user).then((data)=>{
    //         console.log(data.insertedId);
    //         callback(data);
    //     })
    // },

    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10);
            console.log(userData.password)
            db.get().collection('user').insertOne(userData).then((data) => {
                resolve(data)
            })
        })
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {};
            let user = await db.get().collection('user').findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log("Login success");
                        response.user = user;
                        response.status = true;
                        console.log(response)
                        resolve(response);
                    } else {
                        console.log("Login failed")
                        resolve({ status: false })
                    }
                })
            } else {                
                console.log('Login failed');
                resolve({ status: false })
            }
        })

    },

    doVerifySignup: (userData)=>{
        return new Promise(async(resolve, reject)=>{
            let user = await db.get().collection('user').findOne({email: userData.email});
            resolve(user);
        })
    }

}