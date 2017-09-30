/**
 * Created by ERAZER-ALEX on 5/23/2017.
 */

var ForumsHelper = require('./helpers/Forums.helper.js');

var AuthenticatingUser = require('../../users/auth/helpers/AuthenticatingUser.helper.js');

module.exports = {

    /*
     REST API
     */

    async postAddForum (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let sName = '', sTitle = '', sDescription = '', arrKeywords = [], sCountry='', sCity='',sLanguage='', sIconPic='', sCoverPic='', sCoverColor = '';
        let dbLatitude = 0, dbLongitude = 0, additionalInfo = {} ;

        let parent = '';

        //console.log("@@@@@@@@@@@@@@ psotAddForm request", userAuthenticated);

        if (req.hasOwnProperty('body')){
            sTitle = req.body.title || '';
            sName= req.body.name || '';
            sDescription = req.body.description ||  '';
            arrKeywords = req.body.keywords || [];

            sCountry = req.body.country || '';
            sCity = req.body.city || '';

            dbLatitude = req.body.latitude || -666;
            dbLongitude = req.body.longitude || -666;

            sLanguage = req.body.language || sCountry;

            sIconPic = req.body.iconPic || '';
            sCoverPic = req.body.coverPic || '';
            sCoverColor = req.body.coverColor || '';

            additionalInfo = req.body.additionalInfo || {};
            if (typeof (additionalInfo) === 'string') additionalInfo = JSON.parse(additionalInfo);
            if (typeof additionalInfo.scraped !== 'undefined') additionalInfo.scraped = !!+(additionalInfo.scraped);

            parent = req.body.parent || '';
        }

        console.log('Creating a Forum : ', sTitle);

        return await ForumsHelper.addForum(userAuthenticated, parent, sName, sTitle, sDescription, arrKeywords, sCountry, sCity, sLanguage, sIconPic, sCoverPic, sCoverColor, dbLatitude, dbLongitude, null, additionalInfo);
    },

    async getForum (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        var sId = '';

        if (req.hasOwnProperty('body')){
            sId = req.body.id || '';
        }

        console.log('Creating a Forum : ', sId);

        return await ForumsHelper.getForum(userAuthenticated, sId);

    },

    postEditForum (req, res){



    },

    postDeleteForum (req, res){



    },


}

