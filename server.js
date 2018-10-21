var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pgp = require('pg-promise')();
//var db = pgp(process.env.DATABASE_URL);
var db = pgp('postgres://kevljuputyyhiw:399f04df6089c54bc7509a1ff1e9e7cd0c2d7ec7a0cc116c954fbbc88f5f2a0e@ec2-54-243-147-162.compute-1.amazonaws.com:5432/dfhhcbc1jfs2vk?ssl=true');
//app.use(express.static('www'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var moment = require('moment');
moment().format();


app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/about', function (req, res) {
    var name = 'Patcharapon Mondee'
    var hobbies = ['music', 'movie', 'programing']
    var bdate = '29/01/1998';
    res.render('pages/about', { fullname: name, hobbies: hobbies, Birthday: bdate });
});

//GET products pid
app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    var times = moment().format('MMMM Do YYYY, h:mm:ss a');
    var sql = "select * from products where id= " + pid;
    db.any(sql)
        .then(function (data) {
            //console.log('DATA:' + data);
            res.render('pages/products_edit', { product: data[0], time: times })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })


});

//Display all products
app.get('/products', function (req, res) {
    var id = req.param('id');
    var sql = 'select* from products';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/products', { products: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});

app.get('/report_Product', function (req, res) {
    var id = req.param('id');
    var sql = 'select* from products ORDER BY Price DESC liasmit 10';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/report_Product', { products: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});

// Display all user
app.get('/users/:id', function (req, res) {
    var id = req.params.id;
    var sql = "select * from users where id= " + id;
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/user_edit', { user: data[0] })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

// Display all user
app.get('/users', function (req, res) {
    db.any('select * from users', )
        .then(function (data) {
            console.log('DATA' + data);
            res.render('pages/users', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});
app.get('/report_user', function (req, res) {
    db.any('select * from users ORDER BY  email ASC', )
        .then(function (data) {
            console.log('DATA' + data);
            res.render('pages/report_user', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});

//delete products
app.get('/product_delete/:pid', function (req, res) {
    var id = req.params.pid;
    var sql = 'DELETE FROM products';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })
});


//delete users
app.get('/user_delete/:pid', function (req, res) {
    var id = req.params.pid;
    var sql = 'DELETE FROM users';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users')

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })
});

//add Product
app.get('/insert_product', function (req, res) {
    res.render('pages/insert_product');
})
app.post('/products/insert_product', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `INSERT INTO products (id,title,price)
    VALUES ('${id}', '${title}', '${price}')`;
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')
        })

        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//add user
app.get('/insert_user', function (req, res) {
    res.render('pages/insert_user');
})
app.post('/users/insert_user', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var sql = `INSERT INTO users (id,email,password)
    VALUES ('${id}', '${email}', '${password}')`;
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users')
        })

        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//update product
app.post('/products/update', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `update products set title='${title}',price=${price} where id=${id}`;
    // res.send(sql)
    //db.none
    db.query(sql);
    res.redirect('/products')
    db.close();
})

//update users
app.post('/users/update', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var sql = `update users set email='${email}',password='${password}' where id=${id}`;
    // res.send(sql)
    //db.none
    db.query(sql);
    res.redirect('/users')
    db.close();
})





// console.log('app is running at http://localhost:8080');
// app.listen(8080);
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('App is running on http://localhost:' + port);
});


//res.redirect(url)
//