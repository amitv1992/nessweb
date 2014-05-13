var ness = require('nessjs'),
    session = require('express-session'),
    auth = require('./auth');

exports.login_get = function(req, res) {
    if (auth.isLoggedIn(req)) {
        return res.redirect('/');
    }
    var failed_login = req.session.failed_login;
    req.session.failed_login = false;
    var failed_id = req.session.failed_id;
    req.session.failed_id = '';
    var id = failed_login ? failed_id : req.cookies.ness_id;

    res.render('login', {layout: 'login', failed: failed_login, ness_id: id});
};

exports.login_post = function(req, res) {
    auth.login(req, res);
};

exports.logout = function (req, res) {
    if (!auth.isLoggedIn(req)) {
        return res.redirect('/');
    }
    auth.logout(false, req, res);
};

exports.attendance = function(req, res) {
    ness.getModules('attendance', req.session.user, function(err, modules) {
        if (err) {
            return auth.logout(true, req, res);
        }
        res.render('attendance', {modules: modules});
    });
};

exports.modules = function(req, res) {
     ness.getStages({}, req.session.user, function(err, stages) {
        if (err) {
            return auth.logout(true, req, res);
        }
        res.render('modules/modules', {stages: stages});
    });
};

exports.modules.module = function(req, res) {
     ness.getStages({id: req.params.id, year: req.params.year, stage: req.params.stage}, req.session.user, function(err, module) {
        if (err) {
            return auth.logout(true, req, res);
        }
        res.render('modules/module', {module: module});
    });
};

exports.coursework = function(req, res) {
    ness.getModules('coursework', req.session.user, function(err, result) {
        if (err) {
            return auth.logout(true, req, res);
        }
        res.render('coursework/overview', {coursework: result});
    });
}

exports.coursework.calendar = function(req, res) {
    res.render('coursework/calendar');
}

exports.coursework.specification = function(req, res) {
    ness.getSpec(req.params.id, req.session.user, function(err, result) {
        if (err) {
            return auth.logout(true, req, res);
        }
        res.render('coursework/specification', {coursework: result});
    });
}

exports.feedback = function(req, res) {
    ness.getFeedback({ exid: req.params.id }, req.session.user, function(err, result) {
    if (err) {
        return auth.logout(true, req, res);
    }
    res.render('modules/feedback', { layout: false, feedback: result});
    });
}

exports.feedback.exam = function(req, res) {
    ness.getFeedback({ paperId: req.params.id, stid: req.params.stid }, req.session.user, function(err, result) {
    if (err) {
        return auth.logout(true, req, res);
    }
    res.render('modules/feedback', { layout: false, feedback: result});
    });
}

exports.feedback.general = function(req, res) {
    ness.getFeedback({ general: req.params.id }, req.session.user, function(err, result) {
    if (err) {
        return auth.logout(true, eq, res);
    }
    res.render('coursework/feedback', { layout: false, feedback: result});
    })
}

exports.feedback.personal = function(req, res) {
    ness.getFeedback({ personal: req.params.id }, req.session.user, function(err, result) {
    if (err) {
        return auth.logout(true, req, res);
    }
    res.render('coursework/feedback', { layout: false, feedback: result});
    })
}