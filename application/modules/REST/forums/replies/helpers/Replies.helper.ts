/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/30/2017.
 * (C) BIT TECHNOLOGIES
 */

var replyModel = require ('./../models/Reply.model.ts');
var commonFunctions = require ('../../../common/helpers/common-functions.helper.ts');
var URLHashHelper = require ('../../../common/URLs/helpers/URLHash.helper.ts');
var MaterializedParentsHelper = require ('../../../../DB/common/materialized-parents/MaterializedParents.helper.ts');
var SearchesHelper = require ('../../../searches/helpers/Searches.helper.ts');
var striptags = require('striptags');
var hat = require ('hat');
var VotingsHelper = require ('./../../../Voting/helpers/Votings.helper.ts');
var RepliesSorter = require('./../models/RepliesSorter.ts');

module.exports = {

    createDummyForum (iIndex){

        iIndex = iIndex || 0;

        return this.addReply("reply_"+iIndex,"userDummy_"+iIndex, "123456","Gigel",
            "Nume"+iIndex,"RO","Bucharest", "RO", "http://www.gravatar.com/avatar/ee4d1b570eff6ce63"+iIndex+"?default=wavatar&forcedefault=1",
            "http://www.hdfbcover.com/randomcovers/covers/never-stop-dreaming-quote-fb-cover.jpg");
    },

    /*
     FINDING & LOADING REPLY from ID, URL
     */
    async findReply(sRequest){

        console.log("Finding reply :::  " + sRequest);

        var replyFound = await this.findForumById(sRequest);

        if (replyFound !== null) return replyFound;
        else return await this.findForumByURL(sRequest);
    },

    async findReplyById (sId){

        return new Promise( (resolve)=> {

            if ((typeof sId === 'undefined') || (sId == []) || (sId === null))
                resolve(null);
            else
                var ReplyModel  = redis.nohm.factory('ReplyModel', sId, function (err, reply) {
                    if (err) resolve (null);
                    else resolve (ReplyModel);
                });

        });
    },

    findReplyByURL (sURL){

        sURL = sURL || "";
        return new Promise( (resolve)=> {
            if ((typeof sURL === 'undefined') || (sURL == []) || (sURL === null))
                resolve(null);
            else
                return null;

            var ReplyModel = redis.nohm.factory('ReplyModel');
            ReplyModel.findAndLoad(  {URL: sURL }, function (err, replies) {
                if (replies.length) resolve(replies[0]);
                else resolve (null);
            });

        });
    },


    /*
     CREATING A NEW REPLY
     */
    async addReply (userAuthenticated, parent, parentReply, sTitle, sDescription, arrAttachments, arrKeywords, sCountry, sCity, sLanguage, dbLatitude, dbLongitude, dtCreation){

        if ((typeof dtCreation === 'undefined') || (dtCreation === null)) dtCreation = '';

        try{
            sCountry = sCountry || ''; sCity = sCity || ''; dbLatitude = dbLatitude || -666; dbLongitude = dbLongitude || -666; sTitle = sTitle || '';

            sLanguage = sLanguage || sCountry;
            parent = parent || '';

            var reply = redis.nohm.factory('ReplyModel');
            var errorValidation = {};


            //get object from parent
            //console.log("addTopic ===============", userAuthenticated);

            let parentObject = await MaterializedParentsHelper.findObject(parent);

            if (parentObject === null){
                return {
                    result:false,
                    message: 'Parent not found. Probably the topic you had been replying in, has been deleted in the mean while',
                }
            }

            sDescription = striptags(sDescription, ['a','b','i','u','strong', 'h1','h2','h3','h4','h5','div','font','ul','li','img', 'br', 'span','p','div','em']);
            let shortDescription = striptags(sDescription, []);
            if (shortDescription.length > 512) shortDescription = shortDescription.substr(0, 512) + ' ...';

            parentReply = await MaterializedParentsHelper.findObject(parentReply);

            console.log('parentReply',typeof parentReply);

            reply.p(
                {
                    title: sTitle,
                    // URL template: skyhub.com/forum/topic#reply-name
                    URL: await URLHashHelper.getFinalNewURL( parentObject.p('URL') , (sTitle.length > 0 ? sTitle : hat()) , null , '#' ), //Getting a NEW URL
                    description: sDescription,
                    shortDescription: shortDescription,
                    authorId: (userAuthenticated !== null ? userAuthenticated.id : ''),
                    keywords: commonFunctions.convertKeywordsArrayToString(arrKeywords),
                    attachments: arrAttachments,
                    country: sCountry.toLowerCase(),
                    city: sCity.toLowerCase(),
                    language: sLanguage.toLowerCase(),
                    dtCreation: dtCreation !== '' ? Date.parse(dtCreation) : new Date().getTime(),
                    dtLastActivity: null,
                    nestedLevel: (parentReply !== null ? parentReply.p('nestedLevel') + 1 : 1),
                    parentReplyId: await MaterializedParentsHelper.getObjectId(parentReply),
                    parentId: await MaterializedParentsHelper.getObjectId(parent),
                    parents: (await MaterializedParentsHelper.findAllMaterializedParents(parent)).toString(),
                }
            );

            console.log('parentReplyDone',typeof reply);

            if (dbLatitude != -666) reply.p('latitude', dbLatitude);
            if (dbLongitude != -666) reply.p('longitude', dbLongitude);

            return new Promise( (resolve)=> {

                if (Object.keys(errorValidation).length !== 0 ){

                    resolve({result: false, errors: errorValidation});
                    return false;
                }

                reply.save(async function (err) {
                    if (err) {
                        console.log("==> Error Saving Reply");
                        console.log(reply.errors); // the errors in validation

                        resolve({result:false, errors: reply.errors });
                    } else {
                        console.log("Saving Reply Successfully");

                        await reply.keepURLSlug();
                        await VotingsHelper.initializeVoteInDB(reply.id, reply.p('parents'));
                        await RepliesSorter.initializeSorterInDB(reply.id, reply.p('dtCreation'));
                        await reply.keepParentsStatistics();


                        var SearchesHelper = require ('../../../searches/helpers/Searches.helper.ts');
                        SearchesHelper.addReplyToSearch(null, reply); //async, but not awaited

                        //console.log(reply.getPublicInformation(userAuthenticated));

                        resolve( {result:true, reply: reply.getPublicInformation(userAuthenticated) });

                    }
                }.bind(this));

            });
        } catch (Exception){
            console.log('############# ERRROR AddReply',Exception.toString());
            return {result:false, message: ' error '};
        }


    },



}


