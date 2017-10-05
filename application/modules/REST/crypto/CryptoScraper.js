let CryptoValues = require('./CryptoValues.js');
let SocketServer = require('./../../socketServer/socketServer.controller.js');

let axios = require('axios');
let observable = require('rxjs/Observable');


let lastTimeScraped = 0;


var CryptoScraper = class{

    constructor(){
        //this.currenciesValues = [333];
    }

    async scrapeCryptosTimer(){

        console.log('scrapeAltcoinsTimer tick');

        let now = (new Date()).getTime();
        let seconds = now % (60*1000);

        let diff = now-lastTimeScraped;
        let diffSeconds = diff % (1000);

        if ((lastTimeScraped == 0)||(seconds == 0) || (diffSeconds > 60)){


            lastTimeScraped = now;
            this.scrapeCryptos();

        }

    }

    async scrapeCryptos(){

        await CryptoValues.scrapeAllCryptos();

        //let currenciesValues = currenciesValues;
        SocketServer.serverSocket.sockets.emit('api/crypto/values',{result:true, lastTimeScraped: lastTimeScraped, currenciesValues: CryptoValues.currenciesValues, length: CryptoValues.currenciesValues.length })

    }



     async initializeCryptoScraper(){

         console.log('-------------- initializeAltcoinsScraper');

         let that = this;
         setInterval( async function (){ return await that.scrapeCryptosTimer() }, 1000);

         await this.scrapeCryptosTimer();

         let connectObservable = observable.Observable.create(observer => {
             SocketServer.serverSocket.on("connection", (data) => {
                 observer.next(data);
             });
         });

         connectObservable.subscribe(socket => {

             socket.emit('api/crypto/values', {result:'socket create', lastTimeScraped: lastTimeScraped, currenciesValues: CryptoValues.currenciesValues});

             console.log('------------- socket emit');
         });




    }



}

module.exports = new CryptoScraper();