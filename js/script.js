const API_KEY = 'e987c9b3ef365c98fc145ab54f1b9e46';
const queryTemplate = function(type, args) {
    return `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${args}`
}

var app = new Vue({
    el: '#root',
    data: {
        a: '',
        queryString: '',
        result: '',
        selectedIndex: false,
        flags:
            {'en': 'us-US.webp',
            'it': 'it_IT.webp',
            'default': 'Flag_of_Genoa.svg.png'}
        
    },
    methods: {
        searchMovies(string) {
          let res = queryTemplate('multi', string);
            this.queryString = '';
            // this.result = [];
            // while (this.result.length < 20)  {}
            axios.get(res)
            .then((response) => {
                // filtra risultati per escludere people
                a = response.data.results.filter((item) => !item.hasOwnProperty('gender'))
                console.log(a)
               this.result = [...a]
                // this.result.push(a)
            })
        },
        getFlag(lang) {
            return this.flags[lang] || this.flags['default']
        },
        showContent(index) {
            document.getElementsByClassName('layover')
        }
    },
    created() { }
})



/* 
 * function (detailed!) description
 *
 * @param  || description
 * @param  || description
 * 
 * @return || description
*/
