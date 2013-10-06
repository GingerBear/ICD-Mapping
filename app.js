var express = require('express');
var mysql   = require('mysql');
var path   = require('path');
var app     = express();
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

app.get('/icd/9/:code', function(req, res) {
  if(req.params.code.length < 0) {
    res.statusCode = 404;
    return res.send('Error 404: Invalid Code');
  }

  var sql = "SELECT icd_10.icd_10_code, short_description, long_description, if_header FROM icd9_icd10_map, icd_10 WHERE " + 
            "icd9_icd10_map.icd_10_code = icd_10.icd_10_code AND " + 
            "icd_9_code = " + req.params.code;

  connection.query(sql, function(err, rows, fields) {

    res.json(rows);
    if (err) throw err;
  });

});

app.listen(3000);
console.log('Listening on port 3000');