const API_KEY = 'e987c9b3ef365c98fc145ab54f1b9e46';
const DOMAIN = 'https://api.themoviedb.org/3/';

var app = new Vue({
    el: '#root',
    // DATA
    data: {
        inMyList: false,
        selectedGen: '',
        inputString: '',
        queryString: 'un prophete',
        kinds: {
            'movies': {
                name: 'FILM',
                queryStr: 'movie',
                genres: [],

                result: [],
                saved: [],

                collapsed: false
            },
            'tv': {
                name: 'SERIE TV',
                queryStr: 'tv',
                genres: [],

                result: [],
                saved: [],

                collapsed: false,
            }
        },
        flags: {
            'en': 'us-US.webp',
            'it': 'it_IT.webp', 
        },

    },
    // COMPUTED
    computed: {
        notEmpty() {
            // Verifica vi siano elementi da stampare a pagina, ritorna un booleano
            if (this.inMyList) {return this.kinds.movies.saved.length  > 0 || this.kinds.tv.saved.length > 0}
            return this.kinds.movies.result.length  > 0 || this.kinds.tv.result.length > 0
        }
    },
    // METHODS
    methods: {
        selectGen(gen) {
            if (this.selectedGen == "") {
                return true
            }
            else {
                return gen.includes(this.selectedGen)
            }

        },
        addToMyList(newItem, kind) {
            /* Verifica che l'ID del film su cui si è cliccato ($newItem) sia presente tra gli elementi
            salvati in $kinds: se presente, viene rimosso, se assente, viene aggiunto.
            */
            const newItemInList = this.kinds[kind].saved.some((savedItem => savedItem.id == newItem.id));

            if (!newItemInList) {
                this.kinds[kind].saved.push(newItem);
            } else {
                this.kinds[kind].saved.splice(this.kinds[kind].saved.indexOf(newItem), 1);
            }
        },
        // API call functions
        searchContent(type, string) {
            if (!string.trim()) {return}
            this.inMyList = false;
            axios.get(this.apiSearchContent(this.kinds[type].queryStr, string))
                .then((response) => {
                    const answer = response.data.results;
                    answer.forEach(element => {
                        // per ogni elemento, fai una ricerca per ID su $DOMAIN: estrai cast e generi (se presenti),
                        // e salvali come proprietà dell'elemento (in un array)
                        element.cast = [];
                        element.genres = [];
                         axios.get(this.apiSearchContentByID(this.kinds[type].queryStr, element.id, '&append_to_response=credits'))
                            .then(cast => {
                                if (cast.data.credits.cast) { element.cast = cast.data.credits.cast.slice(0, 5) }
                                if (cast.data.genres) { element.genres = cast.data.genres.map(item => item.name) }
                            })
                    });
                    this.kinds[type].result = answer;
                });
        },
        searchOnly(type, string) {
            for (el in this.kinds) {
                this.kinds[el].result = []; 
            }
            this.searchContent(type, string);
        },
        searchAll(string) {
            this.selectedGen = '';
            for (el in this.kinds) {
                this.kinds[el].selectedIndex = false;
                this.kinds[el].collapsed = false;
                this.searchContent(el, string);
            }

        },
        getGenresOf(kind) {
            /* ricerca tutti i generi di una determinata categoria ($kind) presenti su $DOMAIN, salvandoli in 
            $kinds[kind]
            */
            axios.get(this.apiSearchGenres(this.kinds[kind].queryStr))
                .then(response => {
                    this.kinds[kind].genres = response.data.genres.map(item => item.name);
                });
        },
        // API query strings
        apiSearchContent(type, args) {
            return `${DOMAIN}search/${type}?api_key=${API_KEY}&query=${args}`
        },
        apiSearchGenres(type) {
            return `${DOMAIN}genre/${type}/list?api_key=e987c9b3ef365c98fc145ab54f1b9e46&language=en-US`
        },
        apiSearchContentByID(type, id, args) {
            return `${DOMAIN}${type}/${id}?api_key=${API_KEY}${args}`
        },

    },
    // MOUNTED
    mounted() {
        for (kind in this.kinds) {
            this.getGenresOf(kind);
        }
        this.searchAll(this.queryString);
    },

})
