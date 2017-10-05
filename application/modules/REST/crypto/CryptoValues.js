let axios = require('axios');

let fiatCurrencies= ['USD','CAD','EUR','AUD','CNY','JPY'];
let cryptoCurrencies = ['BTC','BCH','LTC','ETH'];

let currenciesValues = {6666:333};

module.exports = {

    currenciesValues: currenciesValues,

    async scrapeCrypto (crypto){

        this.currenciesValues[crypto] = {};

        let str = '';

        for (let i=0; i<fiatCurrencies.length; i++)
            str += fiatCurrencies[i].toUpperCase()+',';

        for (let i=0; i<cryptoCurrencies.length; i++)
            str += cryptoCurrencies[i].toUpperCase()+',';

        // example https://min-api.cryptocompare.com/data/price?fsym=LTC&tsyms=BTC,USD,EUR,CAD,
        let requestString = "https://min-api.cryptocompare.com/data/price?fsym="+crypto.toUpperCase()+"&tsyms="+str;

        console.log("requestString", requestString);

        let res = await axios.get(requestString);
        res = res.data;

        for (let prop in res) {
            this.currenciesValues[crypto][prop] = res[prop];
        }

    },

    async scrapeAllCryptos(){

        this.currenciesValues = {};

        for (let i=0; i<cryptoCurrencies.length; i++)
            await this.scrapeCrypto(cryptoCurrencies[i]);

        for (let i=0; i<fiatCurrencies.length; i++){

            this.currenciesValues[fiatCurrencies[i]] = {};
            for (let j=0; j<cryptoCurrencies.length; j++)
                this.currenciesValues[fiatCurrencies[i]][cryptoCurrencies[j]] = 1 / this.currenciesValues[cryptoCurrencies[j]][fiatCurrencies[i]]
        }

        //this.currenciesValues = [{btc:'xxx'},{'ltc:':'yyyy'}];

        return this.currenciesValues;

    }

}