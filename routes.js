const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const _ = require('lodash');
const fetch = require('node-fetch');
const client = require('./server.js');

router.get('/', (req, res)=>{
  res.render("app",{ messages: req.flash(), title:'All records' });
});

router.get('/cmt', (req, res)=>{
    var body = {"search": "@IndiaToday", "page": 0, "results-per-page": 5};
    fetch('https://api.alexandria.io/florincoin/searchTxComment', {
        method: 'POST',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
        .then(res => res.json())
        //.then(res.render("app", json))
        .then(json=>res.render("app", { messages: req.flash(), title:'All records', bdata: json }))
        .catch((e)=>{
          console.log(e);
        });
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
      return res.render('write', {
          data: req.body,
          errors: errors.mapped(),
          title: 'Please Write your review'
      })
    }

    const data = matchedData(req)

    let remarks = data._bdata;
    var toaddress = "oXCsMUyX3mLJEdnn8SXoH6gyPW9Jd6kjYu";
    var amount = 1;

    try {
        client.sendToAddress(toaddress, amount, "Guestbook", "Alam Puri Customer", false, false, 1, 'UNSET', remarks).then((txnid) => console.log(txnid));
    }catch(err){
        console.log("Unable to send FLO." + err.message);
    }

    req.flash('success', 'Your remarks was successfully entered.')
    res.redirect('/')

  }
)

router.get('/getbalance', (req, res)=>{
  client.getBalance().then((balance) =>  res.json({"balance" : balance}));
})


module.exports = router
