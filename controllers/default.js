﻿exports.install = function () {
    F.route('/', view_index);
    F.route('/Register', view_Register);
    F.route('/Login', view_Login);
    F.route('/Registered', view_Registered, ['post']);
    F.route('/Loggedin', view_Loggedin, ['post']);
    F.route('/Loggedin', view_Loggedinget, ['get']);
    F.route('/Edited', view_Edited, ['post']);
    F.route('/Edit', view_Edit, ['post']);
    F.route('/Exit', view_Exit);
    // or
    // F.route('/');
};

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    ObjectID = require('mongodb').ObjectID;

var url = "mongodb://mwdgroup:235711@ds051831.mongolab.com:51831/mwd";


function view_index() {
    var self = this;
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

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var collection = db.collection('login');

        var objid = ObjectID.createFromHexString(self.req.cookie('mwdcookie'));

        collection.findOne({ _id: objid }, {}, function (err, docs) {
            if (docs == null) {
                self.view('Register', "رمز عبور و یاایمیل معتبر نیست ");
            }
            else {
                self.view('Show', docs);
            }
            db.close();
        });
    });

    //var connection = new sql.Connection(config, function (err) {
    //    var request = connection.request();
    //    request.query("select * from RegisterTBL where ID ='" + self.req.cookie('mwdcookie') + "'", function (err, editreturn) {
    //        if (err)
    //            self.view('Register', err.toString());
    //        else {
    //            var selfreturns = editreturn[0];
    //            self.view("Show", selfreturns);
    //        }
    //    });
    //});
}

function view_Registered() {
    var self = this;
    var model = self.post;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var collection = db.collection('login');
        var id = 0;
        var doc;

        //collection.find().sort({ _id: -1 }, function (err, cursor) {
        //    if (err)
        //        self.view('Register', err.toString());
        //    else {
        //        console.log("------------------------2------------------------");
        //        cursor.toArray(function (error, items) {
        //            id = (parseInt(items[0].id) + 1).toString();
        //            console.log("------------------------" + id + "------------------------");
        //            db.close();
        //        });
        //    }
        //});

        collection.findOne({ 'email': model.email }, function (err, docs) {
            if (docs == null) {
                doc = { 'email': model.email, 'name': model.name, 'family': model.family, 'password': model.pass };
                collection.insert(doc, function (err, result) {
                    self.view('Register', "اطلاعات با موفقیت ثبت گردید");
                });
            }
            else {
                self.view('Register', "این ایمیل قبلا ثبت شده");
            }
            db.close();
        });
    });
}

function view_Loggedin() {
    var self = this;
    var model = self.post;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var collection = db.collection('login');

        collection.findOne({ 'email': model.email, 'password': model.pass }, {}, function (err, docs) {
            if (docs == null) {
                self.view('Login', "رمز عبور و یاایمیل معتبر نیست ");
            }
            else {
                if (model.check == "checked") {
                    self.res.cookie('mwdcookie', docs._id, new Date().add('day', 1));
                }
                self.view('Show',docs);
            }
            db.close();
        });
    });
}


function view_Edit() {
    var self = this;
    var model = self.post;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var collection = db.collection('login');

        var objid = ObjectID.createFromHexString(model.id);

        collection.findOne({ _id: objid }, {}, function (err, docs) {
            if (docs == null) {
                self.view('Login', "رمز عبور و یاایمیل معتبر نیست ");
            }
            else {
                self.view('Edit', docs);
            }
            db.close();
        });
    });
}

function view_Edited() {
    var self = this;
    var model = self.post;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var collection = db.collection('login');

        var objid = ObjectID.createFromHexString(model.id);

        collection.update({ _id: objid }, { 'email': model.email, 'name': model.name, 'family': model.family, 'password': model.pass }, function (err , docs) {
            if (err)
                self.view('Login', err.toString());
            else {
                self.view('Login', "اطلاعات با موفقیت تغییر یافت");
            }
            db.close();
        });
    });
}

function view_Exit() {
    var self = this;
    self.res.cookie('mwdcookie', "Deleted", new Date().add('day', -1));
    self.redirect("/");
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