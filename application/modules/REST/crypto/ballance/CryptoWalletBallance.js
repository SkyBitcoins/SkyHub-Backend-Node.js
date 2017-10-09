/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/6/2017.
 * (C) BIT TECHNOLOGIES
 */

class CryptoWalletBallance {

    constructor() {

        console.log('               @@@@@@ CryptoWalletBallance constructor');

        let CryptoWalletBallanceSocket = require('./ballance-socket/CryptoWalletBallanceSocket.js');
        CryptoWalletBallanceSocket.startService(this.newTransactionReceived, true);

    }

    /*
        inputs: { total: 3333, 1:{value:210003, addr:'XXX'} 2:{value:33322, addr:'YYY'},  }
        outputs: { total: 3333, 1:{value:210003, addr:'XXX'} 2:{value:33322, addr:'YYY'},  }
     */

    newTransactionReceived(inputs, outputs, currency){

        this.processNewTransaction(inputs, outputs, currency);

        let outputAddress = '';
        for (let i=0; i<outputs.length; i++)
            if (typeof outputs[i] !== 'undefined')
                outputAddress = outputs[i].addr;

        //TO DO: search the product and update the total currency
        //verify if the income enough to be validated
        product = Find

    }

    processNewTransaction(inputs, outputs, currency){

        currency = currency || 'satoshi';

        for (let i=0; i<inputs.length; i++)
            if (typeof inputs[i] !== 'undefined'){
                if (currency === 'satoshi')
                    inputs[i].value /= 100000000;
            }

        if (currency === 'satoshi')
            inputs.total /= 100000000;

        for (let j=0; j<outputs.length; j++)
            if (typeof outputs[j] !== 'undefined'){
                if (currency === 'satoshi')
                    outputs[i].value /= 100000000;
            }

        if (currency === 'satoshi')
            outputs.total /= 100000000;
    }


}

module.exports = new CryptoWalletBallance();