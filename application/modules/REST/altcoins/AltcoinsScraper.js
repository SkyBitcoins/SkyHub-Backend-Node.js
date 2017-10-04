let AltcoinsValue = require('./AltcoinsValue.js');

let lastTimeScraped = 0;

module.exports = {


    async scrapeAltcoinsTimer(){

        console.log('scrapeAltcoinsTimer tick');

        let now = (new Date()).getTime();
        let seconds = now % (60*1000);

        let diff = now-lastTimeScraped;
        let diffSeconds = diff % (1000);

        if ((lastTimeScraped == 0)||(seconds == 0) || (diffSeconds > 60)){

            await this.scrapeAltcoins();
            lastTimeScraped = now;

        }

    },

    async scrapeAltcoins(){

        await AltcoinsValue.scrapeCryptos();

    },

    async initializeAltcoinsScraper(){

        console.log('-------------- initializeAltcoinsScraper');

        let that = this;
        setInterval(async function(){ return await that.scrapeAltcoinsTimer() }, 1000);

    }

}