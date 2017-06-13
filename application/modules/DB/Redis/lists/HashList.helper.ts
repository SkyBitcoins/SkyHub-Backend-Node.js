/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/5/2017.
 * (C) BIT TECHNOLOGIES
 */


var redis = require ('../../redis_nohm.js');

var HashList = class{

    constructor (tablePrefix){
        this.tablePrefix = tablePrefix || "Hash";
    }


    async setHash(tableName, key, value){

        if (typeof value !== "string")
            value = JSON.stringify(value);

        return new Promise( (resolve)=> {
            redis.redisClient.hset(this.tablePrefix + ":" + tableName, key, value, function (err, answer) {

                console.log("setHash ",err,answer);

                resolve (err === null ? answer : null);
            });
        });

    }

    async getHash(tableName, key){

        return new Promise( (resolve)=> {
            redis.redisClient.hget (this.tablePrefix + ":" + tableName, key, function (err, answer) {

                console.log("getHash ##",key,"###",err,answer);
                resolve (err === null ? answer : null);
            });
        });

    }

    async deleteHash(tableName, key){
        return new Promise( (resolve)=> {
            redis.redisClient.hdel(this.tablePrefix + ":" + tableName, key, function (err, answer){

                console.log("deleteHash ",err, answer);
                resolve (err === null ? answer : null);
            });
        });
    }


};

module.exports = HashList;