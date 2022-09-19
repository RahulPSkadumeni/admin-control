
var db = require('../config/connection')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId

let admin = {
    email: "rahulps995@gmail.com",
    password: "123456"
}

module.exports = {
    doAdminLogin: (adminData)=>{
        return new Promise(async (resolve, reject)=>{
            let adminResponse = {};
            let adminVerify = await adminData.email === admin.email && adminData.password === admin.password;
            if(adminVerify){
                console.log("admin Login success");
                adminResponse.admin = admin;
                adminResponse.adminStatus = true;
                resolve(adminResponse);
            }
                console.log("admin Login failed");
                resolve({adminStatus:false})
            
        })
    },
    
    doVerifySignup: (userData)=>{
        return new Promise(async(resolve, reject)=>{
            let user = await db.get().collection('user').findOne({email: userData.email});
            resolve(user);
        })
    },

    // addUser: (user, callback) => {
    //     console.log(user)
    //     db.get().collection('user').insertOne(user).then((data) => {
    //         console.log(data.insertedId);
    //         callback(data);
    //     })
    // },

    addUser: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10);
            console.log(userData.password)
            db.get().collection('user').insertOne(userData).then((data) => {
            console.log(data)
                resolve(data)
            })
        })
    },
    
    getAllUsers: async (cb) => {
        await db.get().collection('user').find().toArray().then((ta) => {
            cb(ta);
        });
    },
    deleteUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            let deleteUser = await db.get().collection('user').deleteOne({ _id: objectId(userId) });
            resolve(deleteUser)
        })
    },

    getUserDetails: (userId)=>{
        return new Promise((resolve, reject)=>{
            db.get().collection('user').findOne({_id:objectId(userId)}).then(data=>{
                resolve(data)
            })
        })
    },

    updateUser : (userId, user)=>{
        return new Promise((resolve, reject)=>{
            db.get().collection('user').updateOne({_id: objectId(userId)},
                {$set:{
                    name:user.name,
                    email: user.email
                   
                }}).then(data=>{
                    console.log('//////////////////////////////////////////');
                    console.log(data)
                    console.log('//////////////////////////////////////////');
                    resolve(data);
                })
        })
    },

    
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//    doSignup: (user, callback)=>{
//         console.log(user)
//         db.get().collection('user').insertOne(user).then((data)=>{
//             console.log(data.insertedId);
//             callback(data);
//         })
//     },

    // doSignup: (userData) => {
    //     return new Promise(async (resolve, reject) => {
    //         userData.password = await bcrypt.hash(userData.password, 10);
    //         console.log(userData.password)
    //         db.get().collection('user').insertOne(userData).then((data) => {
    //             resolve(data)
    //         })
    //     })
    // },

    // doLogin: (userData) => {
    //     return new Promise(async (resolve, reject) => {
    //         let response = {};
    //         let user = await db.get().collection('user').findOne({ email: userData.email })
    //         if (user) {
    //             bcrypt.compare(userData.password, user.password).then((status) => {
    //                 if (status) {
    //                     console.log("Login success");
    //                     response.user = user;
    //                     response.status = true;
    //                     console.log(response)
    //                     resolve(response);
    //                 } else {
    //                     console.log("Login failed")
    //                     resolve({ status: false })
    //                 }
    //             })
    //         } else {
    //             console.log('Login failed');
    //         }
    //     })

    // },
    // doVerifySignup: (userData)=>{
    //     return new Promise(async(resolve, reject)=>{
    //         let user = await db.get().collection('user').findOne({email: userData.email});
    //         resolve(user);
    //     })
    // }
    

}
 

