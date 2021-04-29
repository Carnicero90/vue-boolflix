const API_KEY = 'e987c9b3ef365c98fc145ab54f1b9e46';
const queryTemplate = function(type, args) {
    return `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${args}`
}

var app = new Vue({
    el: '#root',
    data: {
        test: 'hello Template',
        queryString: '',
        result: '',
    },
    methods: {
        searchMovies(string) {
           const res = queryTemplate('movie', string);
            this.queryString = '';
            axios.get(res)
            .then((response) => this.result = response.data.results)
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
