const API_KEY = 'e987c9b3ef365c98fc145ab54f1b9e46';
const queryTemplate = function(type, args) {
    return `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${args}`
}

var app = new Vue({
    el: '#root',
    data: {
        a: '',
        queryString: '',
        result: [],
        result1: [],
        selectedIndex: false,
        flags:
            {'en': 'us-US.webp',
            'it': 'it_IT.webp',
            'default': 'Flag_of_Genoa.svg.png'}
        
    },
    methods: {
        searchMovies(string) {
        //   let res = queryTemplate('multi', string);
            this.queryString = '';
            let movies = [];
            axios.get(queryTemplate('movie', string))
            .then((response) => {
                a=response.data.results;
                console.log(a);
                // TODO: sdoppiare il tutto in due .get e rimuovere di conseguenza filter
                a = response.data.results.filter((item) => !item.hasOwnProperty('gender'));
               this.result = [...a];
               this.result.forEach(element => {
                   axios.get(`https://api.themoviedb.org/3/movie/${element.id}?api_key=${API_KEY}&append_to_response=credits`)
                   .then(cast => {
                       if(cast.data.credits.cast) {element.cast = cast.data.credits.cast.slice(0,5)};
                        if (cast.data.genres) {element.genres = cast.data.genres}
                    })
               });
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
