/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/18/2017.
 * (C) BIT TECHNOLOGIES
 */

var TopicsHelper = require('./helpers/Topics.helper.js');

var AuthenticatingUser = require('../../users/auth/helpers/AuthenticatingUser.helper.js');

module.exports = {

    /*
     REST API
     */

    async postAddTopic (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let sTitle = '',  sShortDescription = '', sDescription = '', arrAttachments=[], arrKeywords = [], sCountry='', sCity='',sLanguage='';
        let dbLatitude = 0, dbLongitude = 0, sCoverPic='', additionalInfo = {}, price = {}, ratingScoresList = {}, shipping = {}, reviewsList = {}, details = {};

        let parent = '';

        //console.log("@@@@@@@@@@@@@@ postAddTopic request", userAuthenticated);

        if (req.hasOwnProperty('body')){
            sTitle = req.body.title || '';

            sDescription = req.body.description ||  '';
            sShortDescription = req.body.shortDescription ||  '';
            sCoverPic = req.body.coverPic || '';

            arrKeywords = req.body.keywords || [];
            arrAttachments = req.body.attachments || [];

            if (typeof arrAttachments === 'string') arrAttachments = JSON.parse(arrAttachments);

            sCountry = req.body.country || '';
            sCity = req.body.city || '';

            dbLatitude = req.body.latitude || -666;
            dbLongitude = req.body.longitude || -666;

            sLanguage = req.body.language || sCountry;

            // additional information
            additionalInfo = req.body.additionalInfo || {};
            if (typeof (additionalInfo) === 'string') additionalInfo = JSON.parse(additionalInfo);
            if (typeof additionalInfo.scraped !== 'undefined') additionalInfo.scraped = !!+(additionalInfo.scraped);

            details = req.body.details || {};
            if (typeof (details) === 'string') details = JSON.parse(details);

            price = req.body.price || {};
            if (typeof (price) === 'string') price = JSON.parse(price);

            ratingScoresList = req.body.ratingScoresList || {};
            if (typeof (ratingScoresList) === 'string') ratingScoresList = JSON.parse(ratingScoresList);

            shipping = req.body.shipping || {};
            if (typeof (shipping) === 'string') shipping = JSON.parse(shipping);

            reviewsList = req.body.reviewsList || {};
            if (typeof (reviewsList) === 'string') reviewsList = JSON.parse(reviewsList);


            parent = req.body.parent || '';
        }

        console.log('Creating a Topic : ', sTitle);

        return await TopicsHelper.addTopic(userAuthenticated, parent, sTitle, sDescription, sShortDescription, arrAttachments, sCoverPic, arrKeywords, sCountry, sCity, sLanguage, dbLatitude, dbLongitude, null, additionalInfo, details, price, shipping, ratingScoresList, reviewsList);
    },

    async getTopic (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        var sId = '';

        if (req.hasOwnProperty('body')){
            sId = req.body.id || '';
        }

        console.log('Creating a Topic : ', sId);

        return await TopicsHelper.getTopic(userAuthenticated, sId);

    },

    postEditTopic (req, res){



    },

    postDeleteTopic (req, res){



    },


}

