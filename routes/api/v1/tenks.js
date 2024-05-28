var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../../../lib/db');

router.get('/', async function(req, res, next) {
  // first let's get the jwt token from the request
  let token = req.headers.authorization;
  // if there is no token or not in format "BEARER <token>", return a 401 status code
  if (!token || !token.split(' ')[1]) {
    return res.status(401).json({ error: 'Please provide a jwt token' });
  } else {
    // if there is a token, verify it
    // let's remove the Bearer prefix from the token
    token = token.split(' ')[1];
    jwt.verify(token, process.env.jwtSecret, async (err, decoded) => {
      if (err) {
        console.log('ERROR:', err);
        return res.status(401).json({ error: 'Invalid jwt token' });
      } else {
        // we have a valid user here so add to req.user
        req.user = decoded.username;
        // if the token is valid, return the 5 most recent 10-Ks
        const sql = `
          SELECT filing.id, filing_id, company_id, url, items_json, company.name AS company_name, filed_at  
          FROM filing 
          LEFT JOIN company ON filing.company_id = company.id 
          WHERE status = "10-K" 
          ORDER BY filed_at DESC 
          LIMIT 5
        `;
        try {
          const data = await db.all(sql);
          res.json(data);
        } catch (error) {
          console.log('ERROR:', error);
          return res.status(500).json({ error: 'Unable to retrieve 10-Ks' });
        }
      }
    });
  }
});

module.exports = router;
