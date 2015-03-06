exports.install = function () {
    F.route('/', view_index);
    F.route('/Register', view_Register);
    F.route('/Login', view_Login);
    F.route('/Registered', view_Registered, ['post']);
    F.route('/Loggedin', view_Loggedin, ['post']);
    F.route('/Loggedin', view_Loggedinget, ['get']);
    F.route('/Edit', view_Edit, ['post']);
    F.route('/Exit', view_Exit);
    // or
    // F.route('/');
};

//var Db = require('mongodb').Db,
var MongoClient = require('mongodb').MongoClient;
//    Server = require('mongodb').Server,
//    ReplSetServers = require('mongodb').ReplSetServers,
//    ObjectID = require('mongodb').ObjectID,
//    Binary = require('mongodb').Binary,
//    GridStore = require('mongodb').GridStore,
//    Grid = require('mongodb').Grid,
//    Code = require('mongodb').Code,
//    BSON = require('mongodb').pure().BSON,
//    assert = require('assert');

var url = "mongodb://mwdgroup:235711@ds051831.mongolab.com:51831/mwd";


function view_index() {
    var self = this;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var collection = db.collection('login');

        //var cursor = collection.find({ 'id': '2' });
        //var rows = 0;

        //cursor.count(function (err, count) {
        //    rows = count;
        //});


        //var result = cursor.toArray(function (err, items) {
        //    for (var i = 0 ; i < rows; i++)
        //        console.log(items[i].email);
        //});

        //collection.findOne({ 'id': '2' }, function (err, item) {
        //    if (err)
        //        console.log(err.toString());
        //    else
        //        console.log(item.toString());
        //});

        collection.findOne({ 'email': 'hamed.h.1111@gmail.com' }, function (err, doc) {
            if (doc == null) {
                // do whatever you need to do if it's not there
                self.view('Register', "این ایمیل قبلا نثبت شده");
            } else {
                // do whatever you need to if it is there
                self.view('Register', "این ایمیل قبلا ثبت شده");
            }
            db.close();
        });


    });
    //});



    //console.log(cursor[1]);

    //cursor.count(function (err, count) {
    //    console.log("Total matches: " + count);
    //    db.close();
    //});


    //var doc = { 'id': '2', 'email': 'hamed.h.1111@gmail.com', 'name': 'Hamed', 'family': 'hosseini', 'password': '123456' };

    //collection.insert(doc, { w: 1 }, function (err, result) {
    //    if (err)
    //        console.log(err.toString());
    //    else
    //        console.log(result.toString());
    //});

    //});

    self.view('index');
}

function view_Register() {
    var self = this;
    self.view('Register');
}
function view_Login() {
    var self = this;
    if (self.req.cookie('mwdcookie')) {
        self.redirect("/Loggedin");
    }
    else
        self.view('Login', self.req.cookie('mwdcookie'));
}

function view_Loggedinget() {
    var self = this;
    var connection = new sql.Connection(config, function (err) {
        var request = connection.request();
        request.query("select * from RegisterTBL where ID ='" + self.req.cookie('mwdcookie') + "'", function (err, editreturn) {
            if (err)
                self.view('Register', err.toString());
            else {
                var selfreturns = editreturn[0];
                self.view("Show", selfreturns);
            }
        });
    });
}

function view_Registered() {
    var self = this;
    var model = self.post;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var collection = db.collection('login');

        //var id = 0;

        collection.findOne({ 'email': model.email }, function (err, doc) {
            if (doc == null) {
                // do whatever you need to do if it's not there
                self.view('Register', "این ایمیل قبلا ثبت نشده");
            } else {
                // do whatever you need to if it is there
                self.view('Register', "این ایمیل قبلا ثبت شده");
            }
            db.close();
        });

    //    collection.find().sort({ _id: -1 }, function (err, cursor) {
    //        if (err)
    //            console.log(err.toString());
    //        else
    //            cursor.toArray(function (error, items) {
    //                id = parseInt(items[0].id) + 1;
    //                var doc = { 'id': id, 'email': model.email, 'name': model.name, 'family': model.family, 'password': model.pass };
    //            });
    //    });

    //    collection.insert(doc, { w: 1 }, function (err, result) {
    //        if (err)
    //            console.log(err.toString());
    //    });
    //    console.log(result.toString());
    //});

});

//var connection = new sql.Connection(config, function (err) {
//    var request = connection.request();
//    request.query("select count(*) as count from RegisterTBL where Email ='" + model.email + "'", function (err, rows_numer) {
//        if (err)
//            self.view('Register', err.toString());
//        else {
//            var num_of_rows = rows_numer[0].count;
//            if (num_of_rows == 0) {
//                request.query("INSERT INTO RegisterTBL (Name,Family,Email,Password) VALUES ('" + model.name + "','" + model.family + "','" + model.email + "','" + model.pass + "');", function (err, rows) {
//                    if (err) {
//                        self.view('Register', err.toString());
//                    }
//                    else {
//                        self.view('Register', "اطلاعات با موفقیت ثبت شد");
//                    }
//                });

//            }
//            else {
//                self.view('Register', "این ایمیل قبلا ثبت شده");
//            }

//        }

//    });
//});
}

function view_Loggedin() {
    var self = this;
    var model = self.post;

    var connection = new sql.Connection(config, function (err) {
        var request = connection.request();
        request.query("select count(*) as count from RegisterTBL where Email ='" + model.email + "' AND Password ='" + model.pass + "'", function (err, rows_numer) {
            if (err)
                self.view('Login', err.toString());
            else {
                var num_of_rows = rows_numer[0].count;
                if (num_of_rows == 0) {
                    self.view('Login', "رمز عبور و یاایمیل معتبر نیست ");
                }
                else {


                    request.query("select * from RegisterTBL where Email ='" + model.email + "' AND Password ='" + model.pass + "'", function (err, infos) {
                        if (err)
                            self.view('Login', err.toString());
                        else {
                            var myinfo = infos[0];
                            if (model.check == "checked") {
                                self.res.cookie('mwdcookie', myinfo.ID.toString(), new Date().add('day', 1));
                            }
                            self.view('Show', myinfo);
                        }
                    });
                }
            }
        });
    });
}

function view_Edit() {
    var self = this;
    var model = self.post;
    var connection = new sql.Connection(config, function (err) {
        var request = connection.request();
        request.query("select * from RegisterTBL where ID ='" + model.Id + "'", function (err, info) {
            if (err)
                self.view('Login', err.toString());
            else {
                var infos = info[0];
                self.view('Edit', infos);
            }
        });
    });
}

function view_Exit() {
    var self = this;
    self.res.cookie('mwdcookie', "Deleted", new Date().add('day', -1));
    self.view("Index");
}




//getting query listh using mongodb
//var collection = db.collection('login');

//var cursor = collection.find({ 'id': '2' });
//var rows = 0;

//cursor.count(function (err, count) {
//    rows = count;
//});


//var result = cursor.toArray(function (err, items) {
//    for (var i = 0 ; i < rows; i++)
//        console.log(items[i].email);
//});