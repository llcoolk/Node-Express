const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('/Users/leenkim/Persistence/Chinook_Sqlite_AutoIncrementPKs.sqlite');
const bodyParser = require('body-parser');

const handlebars = require('express-handlebars').create({
    defaultLayout: 'main'
});
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/form', (req, res) => {
    res.render('form');
})

// app.get('/album', (req, res) => {
//     db.each(`select distinct(album.title) as album, artist.name as artist 
//             from album
//             join artist using (artistid)`, (err, row) => {
//                 if (err) throw err;
//                 console.log()
//                 res.render('/album');
//             }
//         );
//     });
app.get("/albums", (request, response) => {
    const query = `SELECT artists.Name as Artist, albums.Title as Album from artists JOIN albums USING (artistId)`;
    let resultsArray = [];
    db.each(query, (err, row) => {
        if (err) throw err;
        // console.log(row);
        resultsArray.push(row);
    });
    response.render("albums", { results: resultsArray });
});

// app.get('/album', (request, response) => {
//     var posts = []
//     var i = 0;
//     var message = "";

//     db.serialize(function () {
//         db.each(`SELECT Album.Title, Artist.Name FROM Album JOIN Artist USING ("ArtistId")`, function (err, row) {
//             //posts.push({ Album: row.Title, Artist: row.Name })
//             //message.concat(" ", row.Title + " " + row.Name);
//             //response.send(message);
//             console.log( + i + "- Title: [" + row.Title + "] - Artist: [" + row.Name + "]");
//             i++;   
//         })
//     })
//     response.render('album', posts);
// });

//   db.each(`select distinct(album.title) as album, artist.name as artist 
//   from album
//   join artist using (artistid)`, (err, row) => {
//       if (err) throw err;
//       console.log(row);app.run('/album', (req, res) => {
//     response.render('album');
//     });

app.post('/form', (req, res) => {
    console.log(req.body.artistId);
    db.run(
        `INSERT into Artist(ArtistId, Name) VALUES(${req.body.artistId}, ${
        req.body.name
        })`,
        (err, row) => {
            if (err) throw err;
            db.close();
            res.redirect(303, '/success');
        }
    );
})

app.listen(3000, () => {
    console.log('server running')
});