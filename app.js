var express = require('express'),
    mysql   = require('mysql'),
    path    = require('path'),
    app     = express();

app.configure(function() {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.bodyParser());
    app.use(express.logger("short"));
});

app.get('/', function (req, res) {
    res.sendfile(filedir + '/index.html');
});

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'icd-mapping'
});

connection.connect();

app.get('/icd/9', function(req, res) {

  var sql = "SELECT icd9_icd10_map.icd_9_code, icd_9.description icd_9_description, icd_10.icd_10_code, icd_10.long_description icd_10_description, if_header " + 
            "FROM icd9_icd10_map, icd_10, icd_9 WHERE " + 
            "icd9_icd10_map.icd_9_code = icd_9.icd_9_code AND " + 
            "icd9_icd10_map.icd_10_code = icd_10.icd_10_code AND " + 
            "icd9_icd10_map.icd_9_code = '" + req.query.icd_9 + "'";

  console.log(sql);

  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;
    if (rows.length > 0) {
      var icd_9 = rows[0].icd_9_code;
      var icd_9_description = rows[0].icd_9_description;
      var icd_10_set = [];
      for(var key in rows) {
        icd_10_set.push({
          icd_10_code: rows[key].icd_10_code,
          icd_10_description: rows[key].icd_10_description,
        });
      }
      res.json({
        icd_9_code: rows[0].icd_9_code,
        icd_9_description: rows[0].icd_9_description,
        icd_10: icd_10_set,
        empty: false
      });
    }else{
      res.json({
        empty: true
      });
    };
  });

});

app.get('/icd/10', function(req, res) {

  var sql = "SELECT icd9_icd10_map.icd_10_code, icd_10.long_description icd_10_description, icd_9.icd_9_code, icd_9.description icd_9_description " + 
            "FROM icd9_icd10_map, icd_9, icd_10 WHERE " + 
            "icd9_icd10_map.icd_9_code = icd_9.icd_9_code AND " + 
            "icd9_icd10_map.icd_10_code = icd_10.icd_10_code AND " + 
            "icd9_icd10_map.icd_10_code = '" + req.query.icd_10 + "'";

  console.log(sql);

  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;
    if (rows.length > 0) {
      var icd_10 = rows[0].icd_10_code;
      var icd_10_short_description = rows[0].icd_10_description;
      var icd_9_set = [];
      for(var key in rows) {
        icd_9_set.push({
          icd_9_code: rows[key].icd_9_code,
          icd_9_description: rows[key].icd_9_description,
        });
      }
      res.json({
        icd_10_code: rows[0].icd_10_code,
        icd_10_description: rows[0].icd_10_description,
        icd_9: icd_9_set,
        empty: false
      });
    }else{
      res.json({
        empty: true
      });
    };
  });

});

app.listen(3000);
console.log('Listening on port 3000');