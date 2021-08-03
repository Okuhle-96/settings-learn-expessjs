const express = require('express');

const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');

const setup = exphbs({
  partialsDir: "./views/partials",
  viewPath:  './views',
  layoutsDir : './views/layouts'
});

const SettingsBill = require('./setting-bill')

const app = express();
const settingBill = SettingsBill()

app.use(bodyParser.urlencoded({ extended : false}));

app.use(bodyParser.json())

var moment = require('moment'); // require
moment().format();

app.engine('handlebars', setup);
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', function(req, res){
  let className = "";

  if(settingBill.hasReachedWarningLevel()){
      className = "warning"
  }

  if(settingBill.hasReachedCriticalLevel()){
      className = "danger"
  }

   res.render('index', {
       settings: settingBill.getSettings(),
       totals: settingBill.totals(),
       class: className
   });    
});


app.post('/settings', function(req, res){
    
    settingBill.setSettings({ 
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });

   res.redirect('/');
});

app.post('/action', function(req, res){
    settingBill.recordAction(req.body.actionType)
    
    res.redirect('/');
});

app.get('/actions', function(req, res){
    res.render('actions', 
    {actions: settingBill.actions()})

    const actions = settingBill.actions()

    actions.forEach(elem => {
    elem.timestamps = moment(elem.timestamp).fromNow()})

});

app.get('/actions/:type', function(req, res){
    const actionType = req.params.type;
    res.render('actions',  {actions: settingBill.actionsFor(actionType)})
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, function(){
    console.log('App has Started')
});



