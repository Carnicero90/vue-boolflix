const API_KEY = 'e987c9b3ef365c98fc145ab54f1b9e46';
const queryTemplate = function (type, args) {
    return `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${args}`
};
const queryTemplate2 = function (type, args) {
    return `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${args}`
}

var app = new Vue({
    el: '#root',
    data: {
        a: [],
        selectedGen: '',
        queryString: '',
        resCopy: [],
        result: {
            'movies': [],
            'tv': []
        },
        types: {
            'movies': {
                name: 'FILM',
                genres: [],
                collapsed: false,
                queryStr: 'movie'
            },
            'tv': {
                name: 'SERIE TV',
                genres: [],
                collapsed: false,
                queryStr: 'tv'
            }
        },
        selectedIndex: false,
        movieGenres: [],
        tvGenres: [],
        myList: {
            'movies': [],
            'tv': []
        },
        flags: {
            'en': 'us-US.webp',
            'it': 'it_IT.webp',
            'default': 'Flag_of_Genoa.svg.png'
        },
        visibleTvRange: [0, 4]

    },
    methods: {

        searchContents(string) {
            //   let res = queryTemplate('multi', string);
            this.selectedGen = '';
            // this.queryString = '';
            axios.get(queryTemplate('movie', string))
                .then((response) => {
                    const answer = response.data.results;
                    answer.forEach(element => {
                        axios.get(`https://api.themoviedb.org/3/movie/${element.id}?api_key=${API_KEY}&append_to_response=credits`)
                            .then(cast => {
                                if (cast.data.credits.cast) { element.cast = cast.data.credits.cast.slice(0, 5) }
                                if (cast.data.genres) { element.genres = cast.data.genres.map(item => item.name) }
                            })
                    });
                    this.result.movies = answer;

                });
            axios.get(queryTemplate('tv', string))
                .then((response) => {
                    const answer = response.data.results;
                    answer.forEach(element => {
                        axios.get(`https://api.themoviedb.org/3/tv/${element.id}?api_key=${API_KEY}&append_to_response=credits`)
                            .then(cast => {
                                if (cast.data.credits.cast) { element.cast = cast.data.credits.cast.slice(0, 5) }
                                if (cast.data.genres) { element.genres = cast.data.genres.map(item => item.name) }
                            });

                    });
                    this.result.tv = answer;

                });
            this.resCopy = { ...this.result }
        },
        getFlag(lang) {
            return this.flags[lang] || this.flags['default']
        },
        selectGen(gen) {
            if (this.selectedGen == "") {
                return true
            }
            else {
                return gen.includes(this.selectedGen)
            }

        },
        addToMyList(item, kind) {
            if (!this.myList[kind].includes(item)) {
                this.myList[kind].push(item);
                this.result[kind]
            } else {
                this.myList[kind].splice(this.myList[kind].indexOf(item), 1)
            }
        },
        getGenres(kind) {
            axios.get(`https://api.themoviedb.org/3/genre/${this.types[kind].queryStr}/list?api_key=e987c9b3ef365c98fc145ab54f1b9e46&language=en-US`)
            .then(response => {    
                this.types[kind].genres =  response.data.genres.map(item => item.name);
            });
        }

    },
    mounted() {
        this.searchContents('il sorpasso');
        this.getGenres('movies');
        this.getGenres('tv');
    
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
