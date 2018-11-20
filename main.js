const electron = require('electron');
const path = require('path');
const url = require('url');
const editJsonFile = require("edit-json-file");
var fs = require('fs');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
var easymidi = require('easymidi');

let conf = editJsonFile('./config.json');
let MIDImapping = editJsonFile('./mapping.json');
var device

// Reload it from the disk
conf = editJsonFile(`${__dirname}/config.json`, {
    autosave: true
});
MIDImapping = editJsonFile(`${__dirname}/mapping.json`, {
    autosave: true
});

// Monitor all MIDI inputs with a single "message" listener

var MIDIMapON = false;
var OBSSendON = false;



//var index = require('./index.js');
// If the file doesn't exist, the content will be an empty object by default.

try {
'use strict';
var os = require('os');
var ifaces = os.networkInterfaces();
} catch (ex) {
    console.log(ex);
    if(ex.code == 'MODULE_NOT_FOUND'){
	    console.log('MODULE_NOT_FOUND')
    }
}
// SET ENV
process.env.NODE_ENV = 'development';
const {app, BrowserWindow, Menu, ipcMain} = electron;
let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', function(){
  // Create new window
    mainWindow = new BrowserWindow({});
    
    mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'public/electron/mainWindow.html'),
            protocol: 'file:',
            slashes:true,
        title:'OBS Net Control'
	  }));
    
//console.log(config_file.get("firststart"));

// Quit app when closed
  mainWindow.on('closed', function(){
    app.quit();
  });
    
// Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

// Handle add item window
function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 300,
    height:200,
    title:'OBS Net Control'
  });
    
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'public/electron/addWindow.html'),
    protocol: 'file:',
    slashes:true
  }));
    
  // Handle garbage collection
  addWindow.on('close', function(){
    addWindow = null;
  });
}
 // Create menu template
const mainMenuTemplate =  [
  // Each object is a dropdown
  {
    label: 'File',
    submenu:[         
      {
        label: 'Quit',
        accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];
// If OSX, add empty object to menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}
// Add developer tools option if in dev
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
        
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}
var config = conf.toObject()
ipcMain.on('event', (event, data) => { 
   
}) 
function loadHTML(data){
	mainWindow.loadURL(url.format({
	    pathname: path.join(__dirname, data),
	    protocol: 'file:',
	    slashes:true
	}));
    
}


function setJSON(data) {
	conf.set(data.name, data.val);
}

ipcMain.on('DOM', (event, data) => {
           console.log("DOM Data : " + data);
})

ipcMain.on('OBC', (event, data) => {
           console.log("DOM Data : " + data);
            conf.set(data.cmd, data.d);
            
})
ipcMain.on('OBC_CONNECT', (event, data) => {
           console.log("DOM Data : " + data);
            obsconnect()
    
})

ipcMain.on('OBC_CMD', (event, data) => {
    console.log("OBC_CMD : " + JSON.stringify(data));
    obs.send(data.cmd,data.d, (err, data) => {
        console.log(err, data);
    });
})

ipcMain.on('OBC_REPLAY', (event, data) => {
           console.log("OBC_REPLAY : " + JSON.stringify(data));
           var c = conf.get()
           replay(c.replay)
})

ipcMain.on('NC_GET_CONF', (event, data) => {
           console.log("OBC_Start : " + JSON.stringify(data));
           event.returnValue = conf.get()
    //var c = conf.get()
   // mainWindow.webContents.send('LIST', {"name": "scenes", "data": c.scenes} );
})
ipcMain.on('MIDIMapping', (event, data) => {
           //console.log("OBC_Start : " + JSON.stringify(data));
           event.returnValue = MIDImapping.get()
    //var c = conf.get()
   // mainWindow.webContents.send('LIST', {"name": "scenes", "data": c.scenes} );
})
ipcMain.on('NC_DISCONNECT', (event, data) => {
           console.log('NC_DISCONNECT' + JSON.stringify(data));
          
        
})
ipcMain.on('NC_SCENESWITCH', (event, data) => {
           console.log('NC_SCENESWITCH = ' + data.cmd.trim());
           
            swScene(data.cmd.trim());
})
ipcMain.on('NC_SOURCESW', (event, data) => {
           console.log('NC_SOURCESW = ' + data.cmd.trim());
           
            swScene(data.cmd.trim());
})


ipcMain.on('NC_SET_CONF', (event, data) => {
    console.log('NC_CONF = ' + data);
    conf.set(data);
    mainWindow.webContents.send('NC_SET_CONF', data );
})
ipcMain.on('NC_SET_MAP', (event, data) => {
    console.log('NC_MAP = ' + data.channel);
    //MIDImapping.set(data);
    MIDImapping.set(data.d.channel + '.' + data.d.note + data.d._type, data.d)
    //mainWindow.webContents.send('NC_SET_CONF', data );
})

ipcMain.on('sendjsontest', (event, data) => {
    console.log('sendjsontest = ' + data);
    
    var s = {"channel": 6,
      "note": 53,
      "velocity": 127,
      "_type": "noteon"}
    testing(s);
})



// 


//setJSON({name: "username", val: "Steffen"})

 // Output the whole thing
//console.log(config_file.toObject());
// { planet: 'Earth',
//   name: { first: 'Johnny', last: 'B.' },
//   is_student: false,
//   a: { new: { field: [Object] } } }


function obsconnect(){
    var c = conf.get()
    console.log('Config = ip == ' + JSON.stringify(c));
    //console.log('Config = pass == ' + c.obsnet.pass);
    OBSSendON = true;

    obs.connect({ address: c.obsnet.ip, password: c.obsnet.pass })
        .then(() => {
            console.log('Verbunden mit dem OBS Server ' + c.obsnet.ip );
        obs.GetSceneList({}, (err, Scene) => {
        console.log("Scene:", err, Scene);
        conf.set('scenes', Scene.scenes);
        mainWindow.webContents.send('LIST', {"name": "scenes", "data": Scene.scenes} );
        
    });
      })
        .catch(err => { // Promise convention dicates you have a catch on every chain.
            console.log(err);
      });
    
}

//console.log('Config = Test == ' + tesst.obsnet.ip);


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
    var mstime = data.buffertime
    mstime + data.bufsafet;
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
        }, data.bufsafet); 
}

function swScene(data){
    console.log(data);
    obs.setCurrentScene({'scene-name': data});
}

function test(){
    console.log('test');
    obs.send('GetCurrentScene',{}, (err, data) => {
        console.log(err, data);
    });
    
    
    
    
}

ipcMain.on('f_mapping_start', (event, data) => {
    
    MIDIMapON = true;
})
ipcMain.on('f_mapping_stop', (event, data) => {
   // device.close();
    MIDIMapON = false;
    OBSSendON = false;
}) 




function MIDI(){
        easymidi.getInputs().forEach(function(inputName){
            device = new easymidi.Input(inputName);
        }); 
    
    var MIDIdevice
    easymidi.getInputs().forEach(function(inputName){
        //MIDIdevice = new easymidi.Input(inputName);
    });
    device.on('message', function (msg) {
        if(msg._type == 'cc'){
           
        }else if(OBSSendON){
                var i = msg.channel + '.' + msg.note + msg._type
                var a = MIDImapping.get(i)
                if(boll(a,msg)){
                    if(a.cmds != undefined){
                        a.cmds.forEach(function(element) {
                            console.log(element);
                            obs.send(element,{'scene-name': a.val}, (err, data) => {
                                console.log(err, data);
                            });
                        });
                       }
                }
        }
        if(MIDIMapON){
            mainWindow.webContents.send('MIDI_Mapping', msg );
            MIDImapping.set(msg.channel + '.' + msg.note + msg._type, msg);
        }
          
    });
}

function boll(a, b){
    if(a.channel == b.channel && a.note == b.note && a._type == b._type){
        return true
    }else{
        return false
    }
}

function testing(msg){
    
    var i = msg.channel + '.' + msg.note + msg._type
    var a = MIDImapping.get(i)
   
    console.log('Testing msg = ' + msg.channel)
    console.log('Testing a = ' + a.channel)
    
    if(boll(a,msg)){
            console.log('Testing msg Check= ' + a)
            
            a.cmds.forEach(function(element) {
                console.log(element);
            });
            
        }
}


MIDI()