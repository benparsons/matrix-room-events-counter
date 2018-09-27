var config = require('../project-health-github/config.json');
var mysql = require('mysql');
var mysqlConn = mysql.createConnection(config.mysqlLocal);
mysqlConn.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
const parse = require('csv-parse')
const fs = require('fs');
var files = fs.readdirSync("data/");
console.log(files);
files.forEach(file => {
    var data = fs.readFileSync("data/" + file, 'utf-8');
    var parsed = parse(data, {columns:true}, function(err, rows){
        console.log(results);
        var rowsHandled = 0; 
        rows.forEach(row => {
            var sql = `
                REPLACE INTO advocacy_room_health (
                    ds, room_id, canonical_alias, message_count, sender_count
                )
                VALUES (
                    '${row.ds}',
                    '${row.room_id}',
                    '${row.canonical_alias}',
                    ${row.message_count},
                    ${row.sender_count}
                )
            `;
            mysqlConn.query(sql, function() {
                rowsHandled++;
                if (rowsHandled === rows.length) {
                    process.exit(0);
                }
            });
        });
                
    });
});
