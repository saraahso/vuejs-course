new Vue({
    el: '#app',
    mounted() {
        this.getCurrencies()
    },
    data: {
        currencies: {},
        amount: 0,
        from: 'EUR',
        to: 'BRL',
        result: 0,
        loading: false
    },
    computed: {
        formattedCurrencies() {
            return Object.values(this.currencies)
        },

        calculateResult() {
            return (Number(this.amount) * this.result).toFixed(3)
        },

        disabled() {
            return this.amount === 0 || !this.amount || this.loading
        }
    },
    methods: {

        getCurrencies() {

            const currencies = localStorage.getItem('currencies')

            if (currencies) {
                this.currencies = JSON.parse(currencies)

                return
            }

            axios.get('https://free.currconv.com/api/v7/currencies?apiKey=c0d3f018635c5fe2c631')
                .then(response => {
                    const {
                        results
                    } = response.data
                    localStorage.setItem('currencies', JSON.stringify(results))
                    this.currencies = results
                })
        },

        convertCurrency() {
            const key = `${this.from}_${this.to}`

            this.loading = true

            axios.get(`https://free.currconv.com/api/v7/convert?apiKey=c0d3f018635c5fe2c631&q=${key}&compact=ultra`)
                .then(response => {
                    this.loading = false
                    this.result = response.data[key]
                })
        }
    },

    watch: {
        from() {
            this.result = 0
        },
        to() {
            this.result = 0
        }
    }
})