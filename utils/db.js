const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
const config = require("./conf");

class Db {
    static getInstance() {
        if (!Db.instance) {
            Db.instance = new Db();
        }
        return Db.instance;
    }

    constructor() {
        this.dbClient = '';
        this.connect();
    }

//连接数据库
    connect() {
        return new Promise((resolve, reject) => {
            if (!this.dbClient) {
                MongoClient.connect(config.dbUrl, (err, client) => {
                    if (err) {
                        reject(err);
                        console.log("连接数据库失败");
                        return;
                    }
                    console.log("Connected successfully to server");
                    this.dbClient = client.db(config.dbName);
                    resolve(this.dbClient);
// client.close();
                });
            } else {
                resolve(this.dbClient)
            }

        })

    }

//获取改条信息的ObjectId
    getObjectId(id) {
        return new ObjectId(id)
    }

//查询
    find(tableName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(function (db) {
                db.collection(tableName).find(json).toArray(function (err, doc) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(doc)
                })
            })
        })

    }
}

module.exports = Db.getInstance();