const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const _ = require('lodash');
const fetch = require('node-fetch');

router.get('/', (req, res)=>{
  res.render("app",{ messages: req.flash(), title:'All records' });
});

router.get('/cmt', (req, res)=>{
    var body = {"search": "Alexandria", "page": 0, "results-per-page": 5};
    fetch('https://api.alexandria.io/florincoin/searchTxComment', {
        method: 'POST',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
        .then(res => res.json())
        .then(json => console.log(json));
})

router.get('/write', (req, res)=>{
  res.render('write', {
    data: {},
    errors: {},
    title: 'Write your review'
  })
})

router.post('/write', [check('_bdata').isLength({min:1}).withMessage('Please write some remarks!').trim()],
  (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      console.log("Errora: ", errors.mapped());
      return res.render('write', {
          data: req.body,
          errors: errors.mapped(),
          title: 'Please Write your review'
      })
    }

    const data = matchedData(req)
    req.flash('success', 'Your remarks was successfully entered.')
    res.redirect('/')

  }
)

module.exports = router
