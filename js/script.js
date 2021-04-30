const API_KEY = 'e987c9b3ef365c98fc145ab54f1b9e46';
const DOMAIN = 'https://api.themoviedb.org/3/';

var app = new Vue({
    el: '#root',
    data: {
        selectedGen: '',
        queryString: '',
        kinds: {
            'movies': {
                name: 'FILM',
                queryStr: 'movie',
                genres: [],

                printed: [],
                result: [],
                saved: [],

                collapsed: false,
                selectedIndex: false,
            },
            'tv': {
                name: 'SERIE TV',
                queryStr: 'tv',
                genres: [],

                printed: [],
                result: [],
                saved: [],

                collapsed: false,
                selectedIndex: false,
            },
            // 'people': {
            //     name: "PEOPLE",
            //     queryStr: 'person'
            // }
        },
        flags: {
            'en': 'us-US.webp',
            'it': 'it_IT.webp',
        },

    },
    methods: {
        printSaved() {
            for (item in this.kinds) {
                this.kinds[item].printed = this.kinds[item].saved;
            }
        },
        printHome() {
            for (item in this.kinds) {
                this.kinds[item].printed = this.kinds[item].result;
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
            const ids = this.kinds[kind].saved.map((item => item.id));

            if (!ids.includes(item.id)) {
                this.kinds[kind].saved.push(item);
            } else {
                this.kinds[kind].saved.splice(this.kinds[kind].saved.indexOf(item), 1);
            }
        },
        // API call functions
        searchContent(type, string) {
            if (!string.trim()) {return}
            axios.get(this.search(this.kinds[type].queryStr, string))
                .then((response) => {
                    const answer = response.data.results;
                    answer.forEach(element => {
                        axios.get(this.byId(this.kinds[type].queryStr, element.id, '&append_to_response=credits'))
                            .then(cast => {
                                if (cast.data.credits.cast) { element.cast = cast.data.credits.cast.slice(0, 5) }
                                if (cast.data.genres) { element.genres = cast.data.genres.map(item => item.name) }
                            })
                    });
                    this.kinds[type].result = answer;
                    this.kinds[type].printed = answer;
                });
        },
        searchAll(string) {
            this.selectedGen = '';
            for (el in this.kinds) {
                this.kinds[el].selectedIndex = false;
                this.kinds[el].collapsed = false;
                this.searchContent(el, string);
            }

        },
        getGenres(kind) {
            axios.get(this.genres(this.kinds[kind].queryStr))
                .then(response => {
                    this.kinds[kind].genres = response.data.genres.map(item => item.name);
                });
        },
        // API query strings
        // TODO: rinomina
        search(type, args) {
            return `${DOMAIN}search/${type}?api_key=${API_KEY}&query=${args}`
        },
        genres(type) {
            return `${DOMAIN}genre/${type}/list?api_key=e987c9b3ef365c98fc145ab54f1b9e46&language=en-US`
        },
        byId(type, id, args) {
            return `${DOMAIN}${type}/${id}?api_key=${API_KEY}${args}`
        },

    },
    mounted() {
        for (item in this.kinds) {
            this.getGenres(item);
        }
        this.searchAll('un prophete');
    }
})
