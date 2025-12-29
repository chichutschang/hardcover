var express = require('express');
const app = express();
var router = express.Router();
var moment = require('moment');
const {updateCurrentlyReading, currentlyreading} = require('./currentlyreading'); 
const {updateRead, read} = require('./read');

/* GET home page. */
router.get('/', async(req, res) => {
  //retrieve currentlyreading from Hardcover API and render on index.ejs
  try {
    // retrieve currently reading book from routes/currentlyreading.js
    const book = await updateCurrentlyReading(currentlyreading);
    //console.log(JSON.stringify(data));
    const books = book.me[0].user_books;
    //console.log(JSON.stringify(books));
    //get title of book
    const title = books[0].book.title;
    //console.log(title);
    //get author of book
    const author = books[0].book.contributions[0].author.name;
    //console.log(author);
    //get Hardcover.app link to book
    const slug = books[0].book.slug;
    const link = `https://hardcover.app/books/${slug}`;
    //console.log(link);
    res.render('index', { 
      title: title, 
      author: author,
      link: link
    });
  } catch (error) {
    console.error(error);
    res.render('index', { books: [], error: error.message});
  }
});


router.get('/read', async(req, res) =>{
  // retrieve currently reading book from routes/read.js
  try{
    const books = await updateRead(read);
    //console.log(JSON.stringify(data));
    const readbooks = books.me[0].user_books;
    //console.log(JSON.stringify(readbooks));
    console.log(readbooks.length);
    const bookshelf = []
    for(var i = 0; i < readbooks.length; i++){
        console.log(i)
        const dateread = moment(readbooks[i].last_read_date).format('MM/DD/YYYY');
        console.log(dateread);
        //get title of book
        const title = readbooks[i].book.title;
        console.log(title);
        //get author of book
        const author = readbooks[i].book.contributions[0].author.name;
        console.log(author);
        //get Hardcover.app link to book
        const slug = readbooks[i].book.slug;
        const link = `https://hardcover.app/books/${slug}`;
        console.log(link);
        //push books into bookshelf array
        bookshelf.push({
          title: title, 
          author: author,
          link: link,
          dateread: dateread
        });
        //console.log(bookshelf)
    }
      //sort by dateread from most recent to least recent
      bookshelf.sort((a, b) =>{
        //convert dates to timestamps for comparison
        const dateA = new Date(a.dateread);
        const dateB = new Date(b.dateread);
        return dateB - dateA; //descending order
      });
      console.log(bookshelf)

    res.render('read', { 
        books: bookshelf,
        title: 'reading'
    });
  } catch (error) {
    console.error(error);
    res.render('read', { books: [], error: error.message} );
  }
});

module.exports = router;
