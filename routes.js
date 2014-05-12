var ness = require('nessjs'),
    session = require('express-session');

exports.login_get = function(req, res) {
    var failed_login = req.session.failed_login;
    req.session.failed_login = false;
    res.render('login', {layout: 'login', failed: failed_login, user: req.session.user});
};

exports.login_post = function(req, res) {
    var user = {
        id: req.body.id,
        pass: req.body.pass
    };

    req.session.user = user;

    ness.getName(user, function(err, name) {
        if (err) {
            req.session.failed_login = true;
            return res.redirect('/login');
        }
        req.session.user.name = name;
        var referer = req.session.referer;
        req.session.referer = null;
        res.redirect(referer || '/');
    });
};

exports.logout = function (req, res) {
    logout(false, req, res);
};

exports.attendance = function(req, res) {
    ness.getModules('attendance', req.session.user, function(err, modules) {
        if (err) {
            return logout(true, req, res);
        }
        res.render('attendance', {modules: modules});
    });
};

exports.modules = function(req, res) {
     ness.getStages({}, req.session.user, function(err, stages) {
        if (err) {
            return logout(true, req, res);
        }
        res.render('modules/modules', {stages: stages});
    });
};

exports.modules.module = function(req, res) {
     ness.getStages({id: req.params.id, year: req.params.year, stage: req.params.stage}, req.session.user, function(err, module) {
        if (err) {
            return logout(true, req, res);
        }
        res.render('modules/module', {module: module});
    });
};

exports.coursework = function(req, res) {
    ness.getModules('coursework', req.session.user, function(err, result) {
        if (err) {
            return logout(true, req, res);
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
            return logout(true, req, res);
        }
        res.render('coursework/specification', {coursework: result});
    });
}

exports.feedback = function(req, res) {
    ness.getFeedback({ exid: req.params.id }, req.session.user, function(err, result) {
    if (err) {
        return logout(true, req, res);
    }
    res.render('modules/feedback', { layout: false, feedback: result});
    });
}

exports.feedback.exam = function(req, res) {
    ness.getFeedback({ paperId: req.params.id, stid: req.params.stid }, req.session.user, function(err, result) {
    if (err) {
        return logout(true, req, res);
    }
    res.render('modules/feedback', { layout: false, feedback: result});
    });
}

exports.feedback.general = function(req, res) {
    ness.getFeedback({ general: req.params.id }, req.session.user, function(err, result) {
    if (err) {
        return logout(true, eq, res);
    }
    res.render('coursework/feedback', { layout: false, feedback: result});
    })
}

exports.feedback.personal = function(req, res) {
    ness.getFeedback({ personal: req.params.id }, req.session.user, function(err, result) {
    if (err) {
        return logout(true, req, res);
    }
    res.render('coursework/feedback', { layout: false, feedback: result});
    })
}

var logout = function (forced, req, res) {
    req.session.failed_login = forced;
    var id = req.session.user.id;
    req.session.user = {id: id};
    res.redirect('/login');
};