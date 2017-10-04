let axios = require('axios');

currenciesValues = [];

fiatCurrencies= ['USD','CAD','EUR','CNY','YAN'];
cryptoCurrencies = ['btc','ltc','eth'];




module.exports = {

    async scrapeCrypto (crypto){

        currenciesValues[crypto] = [];

        let str = '';

        for (let i=0; i<fiatCurrencies.length; i++)
            str += fiatCurrencies[i].toUpperCase()+',';

        for (let i=0; i<cryptoCurrencies.length; i++)
            str +=cryptoCurrencies[i].toUpperCase()+',';

        // example https://min-api.cryptocompare.com/data/price?fsym=LTC&tsyms=BTC,USD,EUR,CAD,
        let requestString = "https://min-api.cryptocompare.com/data/price?fsym="+crypto.toUpperCase()+"&tsyms="+str;

        console.log("requestString", requestString);

        let res = await axios.get(requestString);
        res = res.data;

        for (let prop in res) {
            currenciesValues[crypto][prop] = res[prop];
        }

    },

    async scrapeCryptos(){

        for (let i=0; i<cryptoCurrencies.length; i++)
            await this.scrapeCrypto(cryptoCurrencies[i]);

        for (let i=0; i<fiatCurrencies.length; i++)
            await this.scrapeCrypto(fiatCurrencies[i]);

        console.log("cryptoCurrencies",currenciesValues);

    }

}