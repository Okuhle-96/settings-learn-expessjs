
const express = require('express');
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const SettingsBill = require('./setting-bill')

const app = express();
const settingBill = SettingsBill()


const setup = exphbs({
  partialsDir: "./views/partials",
  viewPath:  './views',
  layoutsDir : './views/layouts'
});

// app.engine('handlebars', exphbs({layoutsDir: "views/layouts/"})); 

app.engine('handlebars', setup);
app.set('view engine', 'handlebars');


app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended : false}));

app.use(bodyParser.json());

var moment = require('moment'); // require
moment().format();


app.get('/', function(req, res){
  let className = "";

  if(settingBill.hasReachedWarningLevel()){
      className = "warning"
  }

  if(settingBill.hasReachedCriticalLevel()){
      className = "danger"
  }
  if(settingBill.totals().grandTotal < settingBill.getSettings().criticalLevel){
        
  }
   res.render('index', {
       settings: settingBill.getSettings(),
       totals: settingBill.totals(),
       classNames: className
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

  
    const actions = settingBill.actions()

    actions.forEach(elem => {
    elem.timestamps = moment(elem.timestamp).fromNow()})

    res.render('actions', 
    {actions: settingBill.actions()
    })


});

app.get('/actions/:type', function(req, res){

   

    const actions = settingBill.actions()

    actions.forEach(elem => {
    elem.timestamps = moment(elem.timestamp).fromNow()})
    
    const actionType = req.params.type;
    res.render('actions',  {actions: settingBill.actionsFor(actionType)})

});

const PORT = process.env.PORT || 4001;

app.listen(PORT, function(){
    console.log('App has Started')
});



