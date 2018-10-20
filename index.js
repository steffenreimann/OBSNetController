const sendkeys = require('sendkeys')
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
const conf = require('./config.json');

var express        	= require('express');
var app            	= express();
var httpServer		= require("http").createServer(app);
var io              = require('socket.io')(httpServer);

var address = conf.obsnet.ip + ':' + conf.obsnet.port;

var obssock = false;



httpServer.listen(conf.httpServer.port);
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/http/index.html');
});
console.log('HTTP Server Läuft unter http://localhost:' + conf.httpServer.port);

io.on('connection', function (socket) {
    
    //socket.emit('news', { hello: 'noob' });
    
    socket.on('cmd', function (data) {
          console.log('SocketIO = ' + data.cmd);
        obs.send(data.cmd,{}, (err, obsdata) => {
            console.log("From OBS : ", err, obsdata);
            socket.emit('cmd', obsdata);
         });
    });
    socket.on('replay', function () {
          console.log('Replay...');
        replay(20);
    });
    socket.on('swScene', function (data) {
          console.log('swScene = ' + data);
        swScene(data)
    });
});


obs.connect({ address: address, password: conf.obsnet.pass })
    .then(() => {
        console.log('Verbunden mit dem OBS Server ' + address );
        obssock = true
        obsconnect();
	  
  })
    .catch(err => { // Promise convention dicates you have a catch on every chain.
        console.log(err);
  });


obs.onSwitchScenes(data => {
  console.log(`New Active Scene: ${data.sceneName}`);
    
});

// You must add this handler to avoid uncaught exceptions.
obs.on('error', err => {
	console.error('socket error:', err);
});


function replay(data){
    obs.SaveReplayBuffer();
    //Umrechnung von Sekunden auf Milisekunden
    var mstime = conf.replay.buffertime
    mstime + conf.replay.bufsafet;
    //Setzt Scene nach 'data' Sekunden auf die voherrige zurück
    obs.getCurrentScene({}, (err, CurrentScene) => {
        console.log("Current Scene:", err, CurrentScene.name);
        setTimeout(function(){ 
                swScene(CurrentScene.name)
            }, mstime);
    });
    //Setzt Scene auf die Replay Scene
    setTimeout(function(){ 
            swScene('replay');
        }, conf.replay.bufsafet); 
}

function swScene(data){
    obs.setCurrentScene({'scene-name': data});
}







function test(){
    console.log('test');
    obs.send('GetCurrentScene',{}, (err, data) => {
        console.log(err, data);
    });
    
    
    
    
}

function obsconnect(){
    if(obssock == true){
    //switchScene('FortniteInGame');
    //replay(20);
    //test();
        
   }
}

/*
sendkeys('BLOB BLOB  !!  ').then(() => console.log('success'))
sendkeys.sync('this is synchronous BLOB BLOB')
var SerialPort = require('serialport');
var device_port = 'COM3';
var BaudRate = 9600;
var port = new SerialPort(device_port, { 
	autoOpen: true ,
	baudRate: BaudRate
	});
// The open event is always emitted
port.on('open', onOpen);
port.on('data', onData);
function onOpen(){
	console.log('Port Open');
	//port.write('r');
}
function onData(data){
	
	console.log('Buffer Data ', data);
	console.log('String Data:', data.toString('hex'));
	
}
*/

