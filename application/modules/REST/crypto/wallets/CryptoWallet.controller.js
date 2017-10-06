/**
 * Created by ERAZER-ALEX on 5/23/2017.
 */

let CryptoWalletsHelper = require('./helpers/CryptoWallets.helper.js');
let MaterializedParentsHelper = require ('../../../DB/common/materialized-parents/MaterializedParents.helper.js');
let AuthenticatingUser = require('../../users/auth/helpers/AuthenticatingUser.helper.js');

module.exports = {

    /*
     REST API
     */

    async postAddCryptoWallet (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let cryptoCurrency = '', productId = '', fiatValue = 0.0, fiatCurrency = '', authorId='';

        //console.log("@@@@@@@@@@@@@@ postAddCryptoWallet  request", userAuthenticated);

        if (req.hasOwnProperty('body')){
            cryptoCurrency = req.body.cryptoCurrency || '';
            productId= req.body.productId || '';
        }

        if (userAuthenticated !== null) authorId = userAuthenticated.id;

        console.log('Creating a Crypto Wallet : ', cryptoCurrency);

        let productObject = await MaterializedParentsHelper.findObject(productId);

        if (productObject === null) return {result:false, message: 'Invalid Product Id'};

        fiatValue = productObject.p('price').price;
        fiatCurrency = productObject.p('price').currency;

        console.log("cryptoCurrency",cryptoCurrency,"fiatValue", fiatValue, "fiatCurrency", fiatCurrency);

        return await CryptoWalletsHelper.addCryptoWallet(userAuthenticated, cryptoCurrency, productId, fiatValue, fiatCurrency, authorId, false);
    },

    async getCryptoWallet (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let address = '';

        if (req.hasOwnProperty('body')){
            address = req.body.address || '';
        }

        console.log('Get Crypto Wallet : ', address);

        return await CryptoWalletsHelper.findWallet(userAuthenticated, address);

    },


}

