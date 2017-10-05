/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/26/2017.
 * (C) BIT TECHNOLOGIES
 */
let bitcoin = require('bitcoinjs-lib');

let cryptoWalletModel = require ('../models/CryptoWallet.model.js');

let ForumsSorter = require('../models/ForumsSorter.js');

module.exports = {

    createDummyWallet (iIndex){

        iIndex = iIndex || 0;

        return this.addForum("forum_"+iIndex,"userDummy_"+iIndex, "123456","Gigel",
            "Nume"+iIndex,"RO","Bucharest", "RO", "http://www.gravatar.com/avatar/ee4d1b570eff6ce63"+iIndex+"?default=wavatar&forcedefault=1",
            "http://www.hdfbcover.com/randomcovers/covers/never-stop-dreaming-quote-fb-cover.jpg");
    },

    /*
        FINDING & LOADING WALLET from ID, URL
     */
    async findWallet(sRequest){

        console.log("Finding Wallet :::  " + sRequest);

        let walletFound = await this.findWalletById(sRequest);

        if (walletFound  !== null) return walletFound ;
        else return await this.findWalletByAddress(sRequest);
    },

    async findWalletById (sId){

        return new Promise( (resolve)=> {

            if ((typeof sId === 'undefined') || (sId === null) || (sId == []) )
                resolve(null);
            else
                var ForumModel  = redis.nohm.factory('CryptoWalletModel', sId, function (err, forum) {
                    if (err) resolve (null);
                    else resolve (ForumModel);
                });

        });
    },

    findWalletByAddress (address){

        address = address || "";
        return new Promise( (resolve)=> {
            if ((typeof address === 'undefined') || (address == []) || (address === null))  resolve(null);
            else {
                let CryptoWalletModel = redis.nohm.factory('CryptoWalletModel');
                CryptoWalletModel.findAndLoad(  { address: address }, function (err, wallets) {
                    if (wallets.length) resolve(wallets[0]);
                    else resolve (null);
                });
            }
        });
    },


    /*
     CREATING A NEW WALLET
     */
    async addCryptoWallet (currency, productId, fiatValue, fiatCurrency, authorId, validated, dtCreation){

        if ((typeof validated === 'undefined')) validated = false;
        if ((typeof authorId === 'undefined')) authorId = '';
        if ((typeof dtCreation === 'undefined') || (dtCreation === null)) dtCreation = '';

        if ((typeof currency === 'undefined')) currency= 'BTC';

        let address = '', wip = '';

        let keyPair = bitcoin.ECPair.makeRandom();

        // Print your private key (in WIF format)
        wip = keyPair.toWIF(); // => Kxr9tQED9H44gCmp6HAdmemAzU3n84H3dGkuWTKvE23JgHMW8gct

        // Print your public key address
        address = keyPair.getAddress() // => 14bZ7YWde4KdRb5YN7GYkToz3EHVCvRxkF

        let cryptoWallet = redis.nohm.factory('CryptoWallet');

        cryptoWallet.p(
            {
                address: address,
                wip: wip,
                productId: productId,
                fiatValue: fiatValue,
                fiatCurrency: fiatCurrency,
                validated: validated,
                authorId: authorId,
                dtCreation:  dtCreation !== '' ? Date.parse(dtCreation) : new Date().getTime(),
            }
        );

        return new Promise( (resolve)=> {

            cryptoWallet.save(async function (err) {
                if (err) {
                    console.log("==> Error Saving Crypto Wallet");
                    console.log(cryptoWallet.errors); // the errors in validation

                    resolve({result:false, errors: cryptoWallet.errors });
                } else {
                    console.log("Saving CryptoWallet Successfully");

                    // await ForumsSorter.initializeSorterInDB(forum.id, forum.p('dtCreation'));

                    //AllPagesList.keepAllPagesList(forum.p('parentId'), forum, false);

                    resolve( {result:true, forum: cryptoWallet.getPublicInformation() });

                }
            }.bind(this));

        });

    },



}


