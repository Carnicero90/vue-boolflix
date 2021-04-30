const API_KEY = 'e987c9b3ef365c98fc145ab54f1b9e46';
const DOMAIN = 'https://api.themoviedb.org/3/';

var app = new Vue({
    el: '#root',
    data: {
        movieDBqueries: {
            // TODO sposta in methods
            search: function (type, args) {
                return `${DOMAIN}search/${type}?api_key=${API_KEY}&query=${args}`
            },
            genres: function (type) {
                return `${DOMAIN}genre/${type}/list?api_key=e987c9b3ef365c98fc145ab54f1b9e46&language=en-US`
            },
            byId: function (type, id, args) {
                return `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}${args}`
            },
        },
        selectedGen: '',
        queryString: '',
        selectedIndex: false,

        kinds: {
            'movies': {
                name: 'FILM',
                queryStr: 'movie',
                genres: [],

                collapsed: false,
            },
            'tv': {
                name: 'SERIE TV',
                queryStr: 'tv',
                genres: [],

                collapsed: false,
            }
        },
        printed: {
            'movies': [],
            'tv': []
        },
        result: {},
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
            axios.get(this.movieDBqueries.search(this.kinds[type].queryStr, string))
                .then((response) => {
                    const answer = response.data.results;
                    answer.forEach(element => {
                        axios.get(this.movieDBqueries.byId(this.kinds[type].queryStr, element.id, '&append_to_response=credits'))
                            .then(cast => {
                                if (cast.data.credits.cast) { element.cast = cast.data.credits.cast.slice(0, 5) }
                                if (cast.data.genres) { element.genres = cast.data.genres.map(item => item.name) }
                            })
                    });
                    // this.kinds[type].searchResult = answer;
                    //#TODO: migrare tutto in kinds
                    this.result[type] = answer;

                });
        },
        searchAll(string) {
            // RESETS
            this.result = {
                'movies': [],
                'tv': []
            },
                this.selectedGen = '';
            for (el in this.kinds) {
                this.kinds[el].collapsed = false;
            }
            // QUERIES
            this.searchContent('movies', string);
            this.searchContent('tv', string);
            this.printed = this.result;

        },


        getFlag(lang) {
            return this.flags[lang] || this.flags['default']
        },
        getCover(content) {
            if(content.poster_path) {
                return `https://image.tmdb.org/t/p/w342/${content.poster_path}`
            }
            else {
                // Default background img
                return 'img/it_IT.webp'
                // TODO trova immagine di sfondo un po' più bellina
            }
        },
        selectGen(gen) {

            if (this.selectedGen == "") {
                return true
            }
            else if (!gen) {
                return false
            }
            else {
                return gen.includes(this.selectedGen)
            }

        },
        addToMyList(item, kind) {
            const ids = this.myList[kind].map((item) => item.id);

            if (!ids.includes(item.id)) {
                this.myList[kind].push(item);
            } else {
                this.myList[kind].splice(this.myList[kind].indexOf(item), 1)
            }
        },
        getGenres(kind) {
            axios.get(this.movieDBqueries.genres(this.kinds[kind].queryStr))
                .then(response => {
                    this.kinds[kind].genres = response.data.genres.map(item => item.name);
                });
        }

    },
    mounted() {
        this.getGenres('movies');
        this.getGenres('tv');
        this.searchAll('il sorpasso');
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
