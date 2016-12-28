connection.query('CREATE TABLE quickplay_users ('
    + 'id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,'
    + 'name varchar(255) DEFAULT NULL,'
    + 'ip varchar(255) DEFAULT NULL,'
    + 'joined_at datetime DEFAULT NULL,'
    + 'left_at datetime DEFAULT NULL'
    + ') ENGINE=InnoDB DEFAULT CHARSET=utf8;' , function(err, rows, fields){
        if(err) throw err;
        console.log('quickplay users table created');
    });


