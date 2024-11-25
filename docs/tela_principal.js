$(document).ready(function () {
    // Função para obter o preço da moeda em USD usando a API CoinGecko
    async function getCoinPrice(coin) {
        try {
            const apiUrl = https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd;
            const response = await fetch(apiUrl);
            const data = await response.json();
            console.log(Preço ${coin}:, data[coin].usd); // Depuração
            return data[coin].usd;
        } catch (error) {
            console.error("Erro ao obter preço da moeda:", error);
            return 0; // Retorna 0 em caso de erro
        }
    }

    // Função para obter as taxas de câmbio de USD para BRL e EUR
    async function getExchangeRates() {
        try {
            const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
            const response = await fetch(apiUrl);
            const data = await response.json();
            console.log("Taxas de câmbio:", data.rates); // Depuração
            return {
                brl: data.rates.BRL,  // Taxa de câmbio USD -> BRL
                eur: data.rates.EUR   // Taxa de câmbio USD -> EUR
            };
        } catch (error) {
            console.error("Erro ao obter taxas de câmbio:", error);
            return { brl: 1, eur: 1 }; // Caso não consiga, usa taxa 1:1
        }
    }

    // Função para atualizar o valor total da carteira e exibir as conversões
    async function updateWallet() {
        console.log("Atualizando valores..."); // Depuração
        // Obter os preços das criptomoedas
        const bitcoinPrice = await getCoinPrice('bitcoin');
        const litecoinPrice = await getCoinPrice('litecoin');
        const ethereumPrice = await getCoinPrice('ethereum');
        const dogecoinPrice = await getCoinPrice('dogecoin');

        // Obter as quantidades inseridas pelo usuário
        const bitcoinQuantity = parseFloat($('#bitcoin-quantity').val()) || 0;
        const litecoinQuantity = parseFloat($('#litecoin-quantity').val()) || 0;
        const ethereumQuantity = parseFloat($('#ethereum-quantity').val()) || 0;
        const dogecoinQuantity = parseFloat($('#dogecoin-quantity').val()) || 0;

        console.log("Quantidades:", bitcoinQuantity, litecoinQuantity, ethereumQuantity, dogecoinQuantity); // Depuração

        // Cálculos do valor total de cada criptomoeda
        const bitcoinTotal = bitcoinQuantity * bitcoinPrice;
        const litecoinTotal = litecoinQuantity * litecoinPrice;
        const ethereumTotal = ethereumQuantity * ethereumPrice;
        const dogecoinTotal = dogecoinQuantity * dogecoinPrice;

        // Exibir os valores totais para cada moeda em USD
        $('#bitcoin-total').text(Valor total Bitcoin: $${bitcoinTotal.toFixed(2)});
        $('#litecoin-total').text(Valor total Litecoin: $${litecoinTotal.toFixed(2)});
        $('#ethereum-total').text(Valor total Ethereum: $${ethereumTotal.toFixed(2)});
        $('#dogecoin-total').text(Valor total Dogecoin: $${dogecoinTotal.toFixed(2)});

        // Calcular o total investido em USD
        const totalInUSD = bitcoinTotal + litecoinTotal + ethereumTotal + dogecoinTotal;
        $('#total-invested').text($${totalInUSD.toFixed(2)});

        // Obter as taxas de câmbio USD -> BRL e USD -> EUR
        const exchangeRates = await getExchangeRates();
        const totalInBRL = totalInUSD * exchangeRates.brl;
        const totalInEUR = totalInUSD * exchangeRates.eur;

        // Exibir os totais convertidos para BRL e EUR
        $('#total-invested-brl').text(R$${totalInBRL.toFixed(2)});
        $('#total-invested-eur').text(€${totalInEUR.toFixed(2)});
    }

    // Atualizar os valores sempre que o usuário mudar a quantidade das criptomoedas
    $('#bitcoin-quantity, #litecoin-quantity, #ethereum-quantity, #dogecoin-quantity').on('input', function () {
        updateWallet();
    });

    // Inicializar a carteira quando a página for carregada
    updateWallet();
});
