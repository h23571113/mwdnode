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

var sql = require('mssql');

var config = {
    user: 'sia',
    password: '54321',
    server: '30Amac',
    database: 'Node'
}

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

    var connection = new sql.Connection(config, function (err) {
        var request = connection.request();
        request.query("select count(*) as count from RegisterTBL where Email ='" + model.email + "'", function (err, rows_numer) {
            if (err)
                self.view('Register', err.toString());
            else {
                var num_of_rows = rows_numer[0].count;
                if (num_of_rows == 0) {
                    request.query("INSERT INTO RegisterTBL (Name,Family,Email,Password) VALUES ('" + model.name + "','" + model.family + "','" + model.email + "','" + model.pass + "');", function (err, rows) {
                        if (err) {
                            self.view('Register', err.toString());
                        }
                        else {
                            self.view('Register', "اطلاعات با موفقیت ثبت شد");
                        }
                    });

                }
                else {
                    self.view('Register', "این ایمیل قبلا ثبت شده");
                }

            }

        });
    });
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