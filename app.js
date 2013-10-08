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

  var sql = "SELECT icd9_icd10_map.icd_9_code, icd_10.icd_10_code, short_description, long_description AS description, if_header FROM icd9_icd10_map, icd_10 WHERE " + 
            "icd9_icd10_map.icd_10_code = icd_10.icd_10_code AND " + 
            "icd_9_code = " + (req.query.icd_9 || "''");

  console.log(sql);

  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;
    if (rows.length > 0) {
      res.json({
        rows: rows,
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

  var sql = "SELECT icd9_icd10_map.icd_10_code, icd_9.icd_9_code, description FROM icd9_icd10_map, icd_9 WHERE " + 
            "icd9_icd10_map.icd_9_code = icd_9.icd_9_code AND " + 
            "icd_10_code = " + ("'" + req.query.icd_10 + "'" || "''");

  console.log(sql);

  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;
    if (rows.length > 0) {
      res.json({
        rows: rows,
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