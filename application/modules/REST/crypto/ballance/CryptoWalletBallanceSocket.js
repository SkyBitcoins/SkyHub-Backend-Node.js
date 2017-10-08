/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/6/2017.
 * (C) BIT TECHNOLOGIES
 */

/*
    TUTORIAL based on https://blockchain.info/api/api_websocket
 */

const WebSocket = require('ws');

let Observable = require('rxjs/Observable');

class CryptoWalletBallanceSocket {

    constructor() {

        console.log('               @@@@@@ Socket CryptoWalletBallance constructor');
    }

    startService(testing){

        if (typeof testing === 'undefined') testing = false;

        if (testing === true){

            let TestingCryptoWalletBallanceSocket = require ('./testing-ballance/TestingCryptoWalletBallanceSocket.js');
            console.log("testing wallet",TestingCryptoWalletBallanceSocket.port, TestingCryptoWalletBallanceSocket.server);

            let that = this;
            setTimeout(function (){ that.createClientSocket('wss://localhost:'+TestingCryptoWalletBallanceSocket.port+'/') }, 3000);

        } else
        {
            this.createClientSocket('wss://ws.blockchain.info/inv');
        }
    }


    createClientSocket(address) {

        this.socket = new WebSocket(address);

        console.log('                  @@@@@@@ createClientSocket');
        this.setSocketReadObservable("open").subscribe(response => {

            console.log('####### Client has connected to the server!');

            this.sendRequest("op","ping");
        });

        this.socket.on('message', function incoming(data) {

            data = JSON.parse(data);

            console.log("##################### message", data);

            if (data.op === "utx"){

                let inputValue = 0, outputValue=0;
                for (let i=0; data.x.inputs.length; i++)
                    inputValue += data.x.inputs[i].prev_out.value;

                for (let i=0; data.x.out.length; i++)
                    outputValue += data.x.out[i].value;

                console.log("#################### received       ",inputValue, outputValue);

            }

        });



        this.socket.on("connect_failed",function () {
            console.log('Connecting failed 222');
        });

        this.socket.on("connect_error",function () {
            console.log('Connecting failed 222');
        });

        this.socket.on("error",function () {
            console.log('crypto wallet error 222');
        });

        this.socket.on("disconnect",function () {
            console.log('disconnect');
        });

    }

    /*
     FUNCTIONS
     */

    subscribeAddress(address){

        this.socket.send( JSON.stringify({"op":"addr_sub", "addr": address}));

    }

    unsubscribeAddress(address){
        this.socket.send( JSON.stringify({"op":"addr_unsub", "addr": address}));
    }


    sendRequest(sRequestName, requestData) {

        if (typeof requestData === 'undefined') requestData = '';

        let object;

        if ((sRequestName !== '') && (requestData !== '')) {
            object = {};
            object[sRequestName] = requestData;
        } else
            object = sRequestName;

        return this.socket.send( JSON.stringify(object) );
    }

    /*
     Sending the Request and Obtain the Promise to Wait Async
     */
    sendRequestGetData(sRequestName, sRequestData, receivingSuffix) {

        if (typeof receivingSuffix === 'undefined') receivingSuffix = '';

        return new Promise((resolve) => {

            this.sendRequest(sRequestName, sRequestData);

            this.socket.once(sRequestName + (receivingSuffix !== '' ? '/'+receivingSuffix : ''), function (resData) {

                /*console.log('SOCKET RECEIVED: ');
                 console.log(resData);*/

                resolve(resData);

            });

        });
    }

    /*
     Sending Request and Obtain the Observable Object
     */
    sendRequestObservable(sRequestName, sRequestData) {

        let result = this.sendRequest(sRequestName, sRequestData);

        return this.setSocketReadObservable(sRequestName);
    }

    setSocketReadObservable(sRequestName) {

        //let observable = new Observable < Object > (observer => {
        let observable = Observable.Observable.create(observer => {
            this.socket.on(sRequestName, (data) => {
                observer.next(data);
            });
        });

        //console.log("OBSERVABLE for "+sRequestName,observable,);
        return observable;
    }

}

module.exports = new CryptoWalletBallanceSocket();