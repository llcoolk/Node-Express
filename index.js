const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const handlebars = require('express-handlebars').create({
    defaultLayout: 'main'
});
const app = express();
const db = new sqlite3.Database('/Users/leenkim/Persistence/Chinook_Sqlite_AutoIncrementPKs.sqlite');
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.render('home');
  });

// app.get('/form', (req, res) => {
//     res.render('form');
// })

// insert new row into Artist table through the form handlebar
app.post('/form', (req, res) => {
    db.run(
      `INSERT into Artist(ArtistId, Name) VALUES(${req.body.artistID}, ${
        req.body.name
      })`,
      (err, row) => {
        if (err) throw err; 
        res.redirect(303, '/success');
      }
    );
})

// app.get('/album', (req, res) => {
//     res.render('album');
// })

// app.get('/album', (req, res) => {
//     db.each(`select distinct(album.title) as album, artist.name as artist 
//             from album
//             join artist using (artistid)`, (err, row) => {
//                 if (err) throw err;
//                 console.log()
//                 db.close();
//                 res.render('/album');
//             }
//         );
//     });

    //------Working: console.log album title, artist name
    //------Not working: app.get

    app.get('/album', (request, response) => {
        var posts = []
        var i = 0;
        var message = "";
    
        db.serialize(function () {
            db.each(`SELECT Album.Title as Album, Artist.Name FROM Album JOIN Artist USING ("ArtistId")`, function (err, row) {
                //posts.push({ Album: row.Title, Artist: row.Name })
                //message.concat(" ", row.Title + " " + row.Name);
                //response.send(message);
                console.log( + i + "- Title: [" + row.Album + "] - Artist: [" + row.Name + "]");
                i++; 
            })
        })
        response.render('album', posts);     
    });
    //-------------------------------------------------------
    
app.listen(3000, () => {
    console.log('server running')
});

db.close();
//   db.each(`select distinct(album.title) as album, artist.name as artist 
//   from album
//   join artist using (artistid)`, (err, row) => {
//       if (err) throw err;
//       console.log(row);app.run('/album', (req, res) => {
//     response.render('album');
//     });

