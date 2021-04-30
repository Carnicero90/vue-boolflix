const API_KEY = 'e987c9b3ef365c98fc145ab54f1b9e46';
const queryTemplate = function(type, args) {
    return `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${args}`
}

var app = new Vue({
    el: '#root',
    data: {
        a: '',
        selectedGen: '',
        queryString: '',
        result: [],
        selectedIndex: false,
        genres: ['Documentary', 'Drama'],
        flags:
            {'en': 'us-US.webp',
            'it': 'it_IT.webp',
            'default': 'Flag_of_Genoa.svg.png'}
        
    },
    methods: {
        searchMovies(string) {
        //   let res = queryTemplate('multi', string);
            this.selectedGen = '';
            this.queryString = '';
            axios.get(queryTemplate('movie', string))
            .then((response) => {
                // TODO: sdoppiare il tutto in due .get e rimuovere di conseguenza filter
               this.result = response.data.results.filter((item) => !item.hasOwnProperty('gender'));
               this.result.forEach(element => {
                   axios.get(`https://api.themoviedb.org/3/movie/${element.id}?api_key=${API_KEY}&append_to_response=credits`)
                   .then(cast => {
                       if(cast.data.credits.cast) {element.cast = cast.data.credits.cast.slice(0,5)}
                        if (cast.data.genres) {element.genres = cast.data.genres.map(item => item.name)}
                    })
               });
            })
        },
        getFlag(lang) {
            return this.flags[lang] || this.flags['default']
        },
        selectGen(gen) {
            if (this.selectedGen=="") {
                return true
            }
            else {
                return gen.includes(this.selectedGen)
            }

        }
    },
    mounted() {
        axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=e987c9b3ef365c98fc145ab54f1b9e46&language=en-US`)
        .then(lastGen => {
            const b = lastGen.data.genres;
            // versione pigra, che prende tutti i generi e non quelli presenti solo nei film selezionati (quindi da rifare)
            this.genres = b.map(item => item.name)})
     }
})



/* 
 * function (detailed!) description
 *
 * @param  || description
 * @param  || description
 * 
 * @return || description
*/
