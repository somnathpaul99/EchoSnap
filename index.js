const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const PORT = 8081;
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const cookieParser = require('cookie-parser');
const { checkAuthenticationCookie } = require('./middlewares/authentication');
const Blog = require('./models/blog');

mongoose.connect('mongodb://localhost:27017/EchoSnap').then(() => console.log('MongoDb connected!'));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')))

app.get('/', async (req, res) => {
    const allBlog = await Blog.find({});
    res.render('home', {
        user: req.user,
        allBlog
    });
})

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT, () => console.log(`Server up and running at ${PORT}`));