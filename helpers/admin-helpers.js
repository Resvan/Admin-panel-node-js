var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { ObjectID } = require('bson')
var objectId = require('mongodb').ObjectId


module.exports = {
    addUser: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response ={}
            let user = await db.get().collection(collection.USERS_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                resolve(response.status = false)
            } else {
                userData.Password = await bcrypt.hash(userData.Password, 10)
                db.get().collection(collection.USERS_COLLECTION).insertOne(userData).then((data) => {
                    resolve(response.status = true)
                })

            }
            
        })
    },

    getAllUsers: () => {
        return new Promise(async(resolve, reject) => {
            let users = await db.get().collection(collection.USERS_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    
    
    deleteUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USERS_COLLECTION).deleteOne({ _id: objectId(userId) }).then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    },
    doSignp: (adminData) => {
        return new Promise(async (resolve, reject) => {
            adminData.Password = await bcrypt.hash(adminData.Password, 10)
            db.get().collection(collection.ADMINS_COLLECTION).insertOne(adminData).then((data) => {
                console.log(data);
                resolve(data)
            })

        })


    },

    doLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let admin = await db.get().collection(collection.ADMINS_COLLECTION).findOne({ Email: adminData.Email })
            if (admin) {
                bcrypt.compare(adminData.Password, admin.Password).then((status) => {
                    if (status) {
                        response.admin = admin
                        response.status = true
                        resolve(response)
                    } else {
                        resolve({ status: false })
                    }
                })
            } else {
                resolve({ status: false })
            }
        })
    },
    addAdmin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let admin = await db.get().collection(collection.ADMINS_COLLECTION).findOne({ Email: adminData.Email })
            let response ={}
            if (admin) {
                resolve(response.status = false)
            } else {
                adminData.Password = await bcrypt.hash(adminData.Password, 10)
                db.get().collection(collection.ADMINS_COLLECTION).insertOne(adminData).then((data) => {
                    resolve(response.status = true)
                })
            }
            

        })
    },
    getUser: (userId) => {
        return new Promise(async(resolve, reject) => {
            let user = await db.get().collection(collection.USERS_COLLECTION).findOne({ _id: objectId(userId) })
            resolve(user)
        })
    },
    
    

    editUser: (newData) => {
        return new Promise(async(resolve, reject) => {
            newData.Password = await bcrypt.hash(newData.Password, 10)
            db.get().collection(collection.USERS_COLLECTION).updateOne({ _id: objectId(newData.id) }, {
                $set: {
                    Name: newData.Name,
                    Email: newData.Email
                }
            }).then((response) => {
                resolve(response)
            })
        })
    }
}