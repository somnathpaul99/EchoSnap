const express = require('express');
const User = require('../models/user');
const router = express.Router();
const { createHmac } = require('node:crypto');
const { createTokenForUser } = require('../services/authentication');

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).render('signup', { error: 'Full Name, Email and password are required' });
    }
    await User.create({
        fullName,
        email,
        password
    })
    return res.redirect('/');
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).render('signin', { error: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).render('signin', { error: 'Invalid email or password' });
    }

    // Hash incoming password with user's salt
    const hashedPassword = createHmac('sha256', user.salt)
        .update(password)
        .digest('hex');

    if (hashedPassword !== user.password) {
        return res.status(401).render('signin', { error: 'Invalid email or password' });
    }

    const token = createTokenForUser(user);
    return res.cookie('token', token).redirect('/');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/signin', (req, res) => {
    res.render('signin');
});

router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
});

module.exports = router;