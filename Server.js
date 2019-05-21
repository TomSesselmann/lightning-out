var express = require('express'),
    http = require('http'), 
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();
	
var https = require('https');
var fs = require('fs');
 
	
var logFmt = require("logfmt");

app.use(express.static(__dirname + '/public')); 

app.use(bodyParser.json());  

app.set('port', process.env.PORT || 8080);

/*Allow CORS*/
app.use(function(req, res, next) {
	 
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization,X-Authorization'); 
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');
	res.setHeader('Access-Control-Max-Age', '1000');
	  
	next();
});



app.all('/proxy',  function(req, res, next) { 
    
    var url = req.header('SalesforceProxy-Endpoint');  
    request({ url: url, method: req.method, json: req.body, 
                    headers: {'Authorization': req.header('X-Authorization'), 'Content-Type' : 'application/json'}, body:req.body }).pipe(res);    
    
});
 
app.get('/' ,  function(req,res,next) {
    res.sendFile('views/index.html', { root: __dirname });
} );

app.get('/knowledge' ,  function(req,res,next) {
    res.sendFile('views/knowledge.html', { root: __dirname });
} );  

app.get('/flow' ,  function(req,res,next) {
    res.sendFile('views/flow.html', { root: __dirname });
} );  

app.get('/chat' ,  function(req,res,next) {
    res.sendFile('views/chat.html', { root: __dirname });
} );  

app.get('/combined' ,  function(req,res,next) {
    res.sendFile('views/combined.html', { root: __dirname });
} );  

app.get('/article/:articleId' ,  function(req,res,next) {
    res.sendFile('views/article.html', { root: __dirname });
} );  

app.get('/form/:formId' ,  function(req,res,next) {
    var formId = req.params.formId;
    switch(formId) {
        case '001': res.sendFile('docs/form1.jpg', { root: __dirname }); break;
        case '002': res.sendFile('docs/form2.pdf', { root: __dirname }); break;
        case '003': res.sendFile('docs/form3.png', { root: __dirname }); break;
    }
} );  

 

// app.listen(app.get('port'), function () {
//     console.log('Express server listening on port ' + app.get('port'));
// });
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

var options = {
    key: fs.readFileSync('./key.pem', 'utf8'),
    cert: fs.readFileSync('./server.crt', 'utf8')
};

https.createServer(options, app).listen(8081);
console.log("Server listening for HTTPS connections on port ", 8081);