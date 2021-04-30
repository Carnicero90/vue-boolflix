const API_KEY = 'e987c9b3ef365c98fc145ab54f1b9e46';
const DOMAIN = 'https://api.themoviedb.org/3/';

var app = new Vue({
    el: '#root',
    data: {
        // API info and "methods"
        movieDBqueries: {
            search: function (type, args) {
                return `${DOMAIN}search/${type}?api_key=${API_KEY}&query=${args}`
            },
            genres: function (type) {
                return `${DOMAIN}genre/${type}/list?api_key=e987c9b3ef365c98fc145ab54f1b9e46&language=en-US`
            },
            byId: function (id, args) { 
                return `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}${args}`},
        },
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
                queryStr: 'movie',
                searchResult: []
            },
            'tv': {
                name: 'SERIE TV',
                genres: [],
                collapsed: false,
                queryStr: 'tv',
                searchResult: []
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

    },
    methods: {
        searchContent(type, string) {
            axios.get(this.movieDBqueries.search(this.types[type].queryStr, string))
            .then((response) => {
                const answer = response.data.results;
                answer.forEach(element => {
                    axios.get(this.movieDBqueries.byId(element.id, '&append_to_response=credits'))
                        .then(cast => {
                            if (cast.data.credits.cast) { element.cast = cast.data.credits.cast.slice(0, 5) }
                            if (cast.data.genres) { element.genres = cast.data.genres.map(item => item.name) }
                        })
                });
                // this.types[type].searchResult = answer;
                //#TODO: migrare tutto in types
                this.result[type] = answer;

            });      
        },
        searchAll(string) {
            this.selectedGen = '';
            this.searchContent('movies', string);
            this.searchContent('tv', string);
            this.resCopy = {...this.result};
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
            axios.get(this.movieDBqueries.genres(this.types[kind].queryStr))
                .then(response => {
                    this.types[kind].genres = response.data.genres.map(item => item.name);
                });
        }

    },
    mounted() {
        this.searchAll('il sorpasso');
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
