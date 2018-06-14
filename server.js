const express = require('express');
const request = require('request');
const app = express();

//put images, css files, font files, etc in the public folder
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { movieList: movieList });
});

//this end point is for the Movie Details page (movie.ejs) from myFavMovie function
app.get('/movie/:movieId', (req, res) => {
    let userMovie = req.params.movieId;
    res.render('movie', {
        movies: movieList[userMovie]
    });
});

//this end point is for the search bar (search.ejs)
app.get('/movieSearch', (req, res) => {
    getMovies(res, req.query.movieTitle);
});

app.get('/remoteMovie/:movieAPI', (req, res) => {
    let movieId = req.params.movieAPI;
    getMovieById(res, movieId)
});


//this function will search TMDB database and return all the movies from TMDB based on the search bar query
//all of the data (ie object-key pairs) is logged
function getMovies(res, movieTitle) {
    let movieInfo =
        {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/search/movie', //the search movie path
            qs:
                {
                    include_adult: 'false',
                    page: '1',
                    query: movieTitle, //the variable you want to search for, in this case the user's movie choice entered into the search form
                    language: 'en-US',
                    api_key: '73ac886aa7271e9e437345d553ac3900'
                },
            body: '{}'
        };

    request(movieInfo, function (error, response, body) {
        if (!error) {
            let movieData = JSON.parse(body);
            if (movieTitle === movieData.results) {
                let titles = [];
                for (let i = 0; i < movieData.length; i++) {
                    titles.push(movieData[i].title);
                }
                movieData[i] = titles.join(", ")
            }
            //console.log(movieData) //to check body object
            res.render('search', { movie: movieData.results })
            //Bring user to error.ejs if they enter an invalid movie title || enter an invalid paramter in the url
        } else if (error) {
            res.render('error', );
        }
    })
}

//this function is used to get the movies by their specific ID which can then be used in the end point to display the movie details on the movie.ejs page
const getMovieById = (res, movieId) => {
    let options =
        {
            method: 'GET',
            url: `http://api.themoviedb.org/3/movie/${movieId}`,
            qs:
                {
                    api_key: '73ac886aa7271e9e437345d553ac3900'
                },
            body: '{}'
        };
    request(options, function (error, response, body) {
        if (!error) {
            let movieData = JSON.parse(body);
            console.log(movieData);
            res.render('remoteMovie', { remoteMovie: movieData })
        }
    });
}

//this function will be used to display my fav movies on the homepage
const myFavMovies = () => {
    return [{
        title: 'True Romance',
        poster_path: 'https://ia.media-imdb.com/images/M/MV5BYzFhYzg0NTEtMzIwNi00ZDRkLWExNWEtMzQ1OTZiMmIxZGI3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
        year: '1993',
        rated: 'R',
        released: '10 September 1993',
        runtime: '119min',
        genre: 'Drama, Action',
        director: 'Tony Scott',
        writer: 'Quentin Tarantino',
        actors: 'Christian Slater, Patricia Arquette, Dennis Hopper, Gary Oldman',
        plot: 'In Detroit, a lonely pop culture geek marries a call girl, steals cocaine from her pimp, and tries to sell it in Hollywood. Meanwhile, the owners of the cocaine - the Mob - track them down in an attempt to reclaim it.',
        trivia: "Gary Oldman met with Tony Scott about the project, and told him he hadn't had a chance to read the script he'd been sent, then asked Scott what his part would be like. Scott told him 'You're playing a white guy who thinks he's black, and you're a killer pimp.' Oldman laughed and immediately and accepted the role.",
        country: 'USA, France'
    }, {
        title: 'There Will Be Blood',
        poster_path: 'https://ia.media-imdb.com/images/M/MV5BMjAxODQ4MDU5NV5BMl5BanBnXkFtZTcwMDU4MjU1MQ@@._V1_.jpg',
        year: '2008',
        rated: 'R',
        released: '25 January 2008',
        runtime: '158min',
        genre: 'Drama',
        director: 'Paul Thomas Anderson',
        writer: 'Paul Thomas Anderson',
        actors: 'Daniel Day-Lewis, Paul Dano, Ciarán Hands',
        plot: 'A story of family, religion, hatred, oil and madness, focusing on a turn-of-the-century prospector in the early days of the business.',
        trivia: 'While on location in Marfa, Texas, No Country for Old Men (2007) was the neighboring film production. One day, Paul Thomas Anderson and his crew tested the pyrotechnical effects of the oil derrick fire, causing an enormous billowing of smoke, intruding the shot that Joel Coen and Ethan Coen were shooting. This caused them to delay filming until the next day when the smoke dissipated. Both this film and No Country for Old Men (2007) would eventually become the leading contenders at the Academy Awards a year and a half later.',
    }, {
        title: 'Pitch Perfect',
        poster_path: 'https://ia.media-imdb.com/images/M/MV5BMTcyMTMzNzE5N15BMl5BanBnXkFtZTcwNzg5NjM5Nw@@._V1_SY1000_CR0,0,631,1000_AL_.jpg',
        released: '5 October 2012',
        runtime: '112min',
        genre: 'Comedy, Musical',
        director: 'Jason Moore',
        writer: 'Kay Cannon, Mickey Rapkin',
        actors: 'Rebel Wilson, Anna Kendrick, Adam Devine, Brittnay Snow',
        plot: "Beca, a freshman at Barden University, is cajoled into joining The Bellas, her school's all-girls singing group. Injecting some much needed energy into their repertoire, The Bellas take on their male rivals in a campus competition.",
        trivia: 'The story line between Bumper and Fat Amy was not in the script. Adam Devine and Rebel Wilson would improvise during their scenes together, and Devine would often try to kiss her. This led to Devine and Wilson to create a backstory for their two characters and their relationship. The filmmakers thought the hostile, sexual chemistry between the two was funny and kept some of the scenes in the film, though according to the two actors, there was a lot that was cut out, including a reference to a one-night stand.',
    }, {
        title: 'Honey I Shrunk The Kids',
        poster_path: 'https://ia.media-imdb.com/images/M/MV5BOTQ1NTg4MDAtOGU0OS00ZGQwLTliZjQtNDEzZjAzZGI5MjFjXkEyXkFqcGdeQXVyNTI4MjkwNjA@._V1_.jpg',
        released: '23 June 1989',
        runtime: '93min',
        genre: 'Comedy',
        director: 'Joe Johnston',
        writer: 'Stuart Gordon, Bryan Yuzna',
        actors: 'Rick Moranis, Matt Frewer, Marcia Strassman',
        plot: 'The scientist father of a teenage girl and boy accidentally shrinks his and two other neighborhood teens to the size of insects. Now the teens must fight diminutive dangers as the father searches for them.',
        trivia: 'In an early version of the script, there were five kids, one of which died during the sprinkler sequence.',
    }, {
        title: 'Full Metal Jacket',
        poster_path: 'https://ia.media-imdb.com/images/M/MV5BNzc2ZThkOGItZGY5YS00MDYwLTkyOTAtNDRmZWIwMGRhYTc0L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SY1000_CR0,0,656,1000_AL_.jpg',
        released: '10 July 1987',
        runtime: '116min',
        genre: 'Drama, War',
        director: 'Stanley Kubrick',
        writer: 'Stanley Kubrick, Michael Herr',
        actors: "Matthew Modine, R. Lee Ermey, Vincent D'Onofrio",
        plot: 'A pragmatic U.S. Marine observes the dehumanizing effects the Vietnam War has on his fellow recruits from their brutal boot camp training to the bloody street fighting in Hue.',
        trivia: 'One scene cut from the movie showed a group of Marines playing soccer. The scene was cut because a shot revealed they were kicking a human head, not a soccer ball.',
    }, {
        title: 'Labyrinth',
        poster_path: 'https://ia.media-imdb.com/images/M/MV5BMjM2MDE4OTQwOV5BMl5BanBnXkFtZTgwNjgxMTg2NzE@._V1_SY1000_CR0,0,648,1000_AL_.jpg',
        released: '27 June 1986',
        runtime: '101min',
        genre: 'Sci-Fi, Thriller',
        director: 'Jim Henson',
        writer: 'Dennis Lee, Jim Henson',
        actors: 'David Bowie, Jennifer Connelly, Toby Froud',
        plot: 'A 16-year-old girl is given 13 hours to solve a labyrinth and rescue her baby brother when her wish for him to be taken away is granted by the Goblin King.',
        trivia: 'One scene cut from the movie showed a group of Marines playing soccer. The scene was cut because a shot revealed they were kicking a human head, not a soccer ball.',
    }
    ]
};
const movieList = myFavMovies();

app.listen(8080, () => {
    console.log('Server listening on port 8080');
    console.log('Press ctl+ c to stop server');
});
