var ctrl = require('../controllers'),
    auth = require('../controllers/auth');
module.exports = function (app) {

    app.get('/', function(req, res){
        res.redirect('/coursework');
    });

    app.get('/login', ctrl.login_get);
    app.get('/logout', ctrl.logout);
    app.post('/login', ctrl.login_post);

    app.get('/coursework', auth, ctrl.coursework);
    app.post('/coursework/submit/upload/:uniq', auth, ctrl.submit.upload);
    app.get('/coursework/submit/:did/:name', auth, ctrl.getSubmit);
    app.post('/coursework/submit/:did/:name', auth, ctrl.submit.submit);
    app.post('/coursework/upload/delete/:uniq', auth, ctrl.submit.deleteFile);
    app.get('/coursework/specification/:id', auth, ctrl.coursework.specification);

    app.get('/calendar', auth, ctrl.calendar);

    app.get('/attendance', auth, ctrl.attendance);

    app.get('/exams', auth, ctrl.exams);

    app.get('/modules', auth, ctrl.modules);
    app.get('/modules/feedback/:id', auth, ctrl.feedback);
    app.get('/modules/feedback/:id/:stid', auth, ctrl.feedback.exam);
    app.get('/modules/:year/:stage/:id', auth, ctrl.modules.module);

    app.get('/feedback/general/:id', auth, ctrl.feedback.general);
    app.get('/feedback/personal/:id', auth, ctrl.feedback.personal);

    app.get('/json/calendar', auth, ctrl.json.calendar);
}
