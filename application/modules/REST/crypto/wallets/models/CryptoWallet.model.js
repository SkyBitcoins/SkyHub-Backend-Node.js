/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/16/2017.
 * (C) BIT TECHNOLOGIES
 */

var redis = require ('../../../../DB/redis_nohm');
var nohmIterator = require   ('../../../../DB/Redis/nohm/nohm.iterator.js');

var CryptoWalletModel = redis.nohm.model('CryptoWalletModel', {

    idGenerator: function (callback){
        return nohmIterator.generateCommonIterator(callback,"crypto");
    },

    properties: {

        address: {
            type: 'string',
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 3
                }]

            ]
        },
        wip: { //password
            type: 'string',
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 3
                }]

            ]
        },
        cryptoCurrency: {
            type: 'string',
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 1
                }]

            ]
        },
        productId: {
            type: 'string',
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 5
                }]

            ]
        },
        fiatValue: {
            type: 'number',
        },
        fiatCurrency: {
            type: 'string',
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 1
                }]

            ]
        },
        validated: {
            type: 'boolean',
        },
        authorId: {
            defaultValue: '',
            type: 'string',
        },

        /*
         COMMON PROPERTIES
         */
        dtCreation: {type: 'timestamp'},

    },
    methods: {

        getPublicInformation : function (userAuthenticated){

            let properties = this.allProperties();

            delete properties.wip;

            return properties;
        },


    },
    //client: redis.redisClient.RedisClient, // the 2nd client to enable notifications
});
