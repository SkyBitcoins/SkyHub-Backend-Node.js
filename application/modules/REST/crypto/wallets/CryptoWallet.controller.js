/**
 * Created by ERAZER-ALEX on 5/23/2017.
 */

var CryptoWalletsHelper = require('./helpers/CryptoWallets.helper.js');

var AuthenticatingUser = require('../../users/auth/helpers/AuthenticatingUser.helper.js');

module.exports = {

    /*
     REST API
     */

    async postAddCryptoWallet (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let currency = '', productId = '', fiatValue = 0.0, fiatCurrency = '', authorId='';

        //console.log("@@@@@@@@@@@@@@ postAddCryptoWallet request", userAuthenticated);

        if (req.hasOwnProperty('body')){
            currency = req.body.currency || '';
            productId= req.body.productId || '';
        }

        if (userAuthenticated !== null) authorId = userAuthenticated.id;

        console.log('Creating a Crypto Wallet : ', currency);

        let productObject = await MaterializedParentsHelper.findObject(productId);

        if (productObject === null) return {result:false, message: 'Invalid Product Id'};

        fiatValue = productObject.price.price;
        fiatCurrency = productObject.price.currency;

        return await CryptoWalletsHelper.addCryptoWallet(userAuthenticated, currency, productId, fiatValue, fiatCurrency, authorId, false);
    },

    async getCryptoWallet (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let address = '';

        if (req.hasOwnProperty('body')){
            address = req.body.address || '';
        }

        console.log('Get Crypto Wallet : ', sId);

        return await CryptoWalletsHelper.findWallet(userAuthenticated, address);

    },


}

