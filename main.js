const electron = require('electron');
const path = require('path');
const url = require('url');
const editJsonFile = require("edit-json-file");
var fs = require('fs');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
var easymidi = require('easymidi');

let conf = editJsonFile('./json/config.json');
let MIDImapping = editJsonFile('./json/mapping.json');
let obs_f = editJsonFile('./json/obs_function.json');
let devices_config = editJsonFile('./json/devices.json');

var devicesarr = [];
var MapWindowDATA


// Reload it from the disk
conf = editJsonFile(`${__dirname}/json/config.json`, {
    autosave: true
});
MIDImapping = editJsonFile(`${__dirname}/json/mapping.json`, {
    autosave: true
});
devices_config = editJsonFile(`${__dirname}/json/devices.json`, {
    autosave: true
});

// Monitor all MIDI inputs with a single "message" listener

var MIDIMapON = false;
var OBSSendON = false;
var MIDIMapHelper = false;





var x = { }; // better would be to have module create an object
var funcstr = "f1";
var jsonFNtest = {fn:"f1",data: "lol data"}

x.f1 = function(data)
{
    console.log('call a function by var');
    console.log(data);
}

//rufe function mit hilfe eines Strings aus einm JSON File auf
x[jsonFNtest.fn](jsonFNtest.data);
 



//var index = require('./index.js');
// If the file doesn't exist, the content will be an empty object by default.

try {
'use strict';
var os = require('os');
var ifaces = os.networkInterfaces();
} catch (ex) {
    //console.log(ex);
    if(ex.code == 'MODULE_NOT_FOUND'){
	    //console.log('MODULE_NOT_FOUND')
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
    mainWindow = new BrowserWindow({
    width: 1000,
    height:500,
    title:'OBS Net Control'
  });
    
    mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'public/electron/mainWindow.html'),
            protocol: 'file:',
            slashes:true,
        title:'OBS Net Control'
	  }));
    
////console.log(config_file.get("firststart"));

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
function createMapWindow(data){
  MapWindow = new BrowserWindow({
    width: 1000,
    height:500,
    title:'Mapping Edit'
  });
    
  MapWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'public/electron/mapWindow.html'),
    protocol: 'file:',
    slashes:true
  }));
    
  // Handle garbage collection
  MapWindow.on('close', function(){
    MapWindow = null;
  });
}
 // Create menu template
const mainMenuTemplate =  [
  // Each object is a dropdown
    {
    label: "Application",
    submenu: [
        { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
        { type: "separator" },
        { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]}, {
    label: "Edit",
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Save Mapping", accelerator: "CmdOrCtrl+S", click: function() { test(); }},
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]}
];
// If OSX, add empty object to menu
if(process.platform == 'darwin'){
 // mainMenuTemplate.unshift({});
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

ipcMain.on('openMapWindow', (event, data) => {
    console.log("openMapWindow : " + data);
    createMapWindow(data);
    MapWindowDATA = data
})

ipcMain.on('MapWindowData', (event, data) => {
    console.log("openMapWindow : " + data);
    event.returnValue = MapWindowDATA;
})



ipcMain.on('DOM', (event, data) => {
           //console.log("DOM Data : " + data);
})

ipcMain.on('OBS', (event, data) => {
           //console.log("DOM Data : " + data);
            conf.set(data.cmd, data.d);
            
})
ipcMain.on('OBS_CONNECT', (event, data) => {
           //console.log("Connect Data : " + data);
            obsconnect()
    
})

ipcMain.on('OBS_CMD', (event, data) => {
    //console.log("OBS_CMD : " + JSON.stringify(data));
    obs.send(data.cmd,data.d, (err, data) => {
        //console.log(err, data);
    });
})

ipcMain.on('OBS_REPLAY', (event, data) => {
           //console.log("OBS_REPLAY : " + JSON.stringify(data));
           var c = conf.get()
           replay(c.replay)
})

ipcMain.on('NC_GET_CONF', (event, data) => {
           //console.log("OBS_Start : " + JSON.stringify(data));
           event.returnValue = conf.get()
    //var c = conf.get()
   // mainWindow.webContents.send('LIST', {"name": "scenes", "data": c.scenes} );
})
ipcMain.on('MIDIMapping', (event, data) => {
           ////console.log("OBS_Start : " + JSON.stringify(data));
            MIDImapping = editJsonFile(`${__dirname}/json/mapping.json`, {
                autosave: true
            });
            if(data != undefined){
               var i = typeselector(data)
                var a = MIDImapping.get(i)
                 event.returnValue = a
               }else{
                   event.returnValue = MIDImapping.get()
               }
    
    MIDImapping = editJsonFile(`${__dirname}/json/mapping.json`, {
                autosave: true
    });
           
    //var c = conf.get()
   // mainWindow.webContents.send('LIST', {"name": "scenes", "data": c.scenes} );
})

ipcMain.on('DeviceList', (event, data) => {
           ////console.log("OBS_Start : " + JSON.stringify(data));
            DeviceList = editJsonFile(`${__dirname}/json/devices.json`, {
                autosave: true
            });
            event.returnValue = DeviceList.get()
})


ipcMain.on('OBS_F', (event, data) => {
           event.returnValue = obs_f.get()
})
ipcMain.on('NC_DISCONNECT', (event, data) => {
           //console.log('NC_DISCONNECT' + JSON.stringify(data));
          
        
})
ipcMain.on('NC_SCENESWITCH', (event, data) => {
           //console.log('NC_SCENESWITCH = ' + data.cmd.trim());
           
            swScene(data.cmd.trim());
})
ipcMain.on('NC_SOURCESW', (event, data) => {
           //console.log('NC_SOURCESW = ' + data.cmd.trim());
           
            swScene(data.cmd.trim());
})


ipcMain.on('NC_SET_CONF', (event, data) => {
    //console.log('NC_CONF = ' + data);
    conf.set(data);
    mainWindow.webContents.send('NC_SET_CONF', data );
})
ipcMain.on('NC_SET_MAP', (event, data) => {
    //console.log('NC_MAP = ' + data.d.cmds[0]);
    //MIDImapping.set(data);
     
    MIDImapping.set(typeselector(data.d), data.d)
    //mainWindow.webContents.send('NC_SET_CONF', data );
})

function obsconnect(){
    var c = conf.get()
    //console.log('Config = ip == ' + JSON.stringify(c));
    ////console.log('Config = pass == ' + c.obsnet.pass);
    OBSSendON = true;

    obs.connect({ address: c.obsnet.ip, password: c.obsnet.pass })
        .then(() => {
            //console.log('Verbunden mit dem OBS Server ' + c.obsnet.ip );
        obs.GetSceneList({}, (err, Scene) => {
        //console.log("Scene:", err, Scene);
        conf.set('scenes', Scene.scenes);
        mainWindow.webContents.send('LIST', {"name": "scenes", "data": Scene.scenes} );
        
    });
      })
        .catch(err => { // Promise convention dicates you have a catch on every chain.
            //console.log(err);
      });
    
}

////console.log('Config = Test == ' + tesst.obsnet.ip);

obs.onSwitchScenes(data => {
  //console.log(`New Active Scene: ${data.sceneName}`);
    
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
        //console.log("Current Scene:", err, CurrentScene.name);
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
    //console.log(data);
    obs.setCurrentScene({'scene-name': data});
}

function test(){
    //console.log('testjojojojo');
    mainWindow.webContents.send('NC_SET_CONF');
}

ipcMain.on('f_mapping_start', (event, data) => {
    MIDIMapON = true;
})

ipcMain.on('f_mapping_stop', (event, data) => {
   // device.close();
    MIDIMapON = false;
    OBSSendON = false;
}) 


var MD = { }; // better would be to have module create an object

var funcstr = "f1";
var jsonFNtest = {fn: "getDevices"}


MD.getDevices = function(){
    var devices = easymidi.getInputs();
    //console.log(diveces)
    if(devices != ""){
            return devices
       }else{
            return false
       }
}

MD.setDevice = function(data){
    var ActivDevs = easymidi.getInputs(); 
    var d = devices_config.get();
    
    for (var id in d) {
        devices_config.set(id + '.isAlive',false);
    }
    
    ActivDevs.forEach(function(inputName){
        var space = ' ';
        var splittet = splitString(inputName, space);
        var devID = splittet[splittet.length - 1]
        var deviceName = splittet
        deviceName.pop(1)
        var PathName = deviceName.join('_')
        deviceName = deviceName.join(space)
        deviceName = deviceName.toString();
        var dconf = devices_config.get()
        var n = {"isAlive": true, "domID": PathName, "id": devID, "name": deviceName, "MapPath": "./json/mappings/" + PathName + ".json", "fn": "" }
        console.log('var deviceName = ', n);
        devices_config.set(PathName,n); 
    }); 
}

MD.ActivMap = function(data){
    console.log(data);
    d = devices_config.get(data);
    console.log('ActivMap Data = ',data);
    console.log('ActivMap = ',d);   
    var name = d.name + ' ' + d.id
    var t = new easymidi.Input(name);
   // MD.message(t);
    MD.MIDI(t, d)
}

MD.message = function(data){
    data.on('message', function (msg) {
        console.log(msg);
    });
}

MD.getMapping = function(data){
    
}

MD.MIDI = function(device, data){
    var device_map = editJsonFile(data.MapPath, {
        autosave: true
    });
   
    if(device != "" && device != undefined){
        device.on('message', function (msg) {
            delete msg["message-id"];
            console.log(msg);
            if(msg._type == 'cc' && !MIDIMapON){
                ////console.log(msg);
                var i = typeselector(msg)
                var a = device_map.get(i)
                if(boll(a,msg)){
                    if(a.cmds != undefined){
                        a.cmds.forEach(function(element) {
                            ////console.log(element);
                            ////console.log(msg.value);
                            var x = Number(msg.value);
                            x = x / 127;
                            x = x.toFixed(4)
                            ////console.log(x);
                            element.ar.volume = x;
                            element.ar.volume = Number(element.ar.volume);
                            ////console.log(element);
                            obs.send(element.rn, element.ar, (err, data) => {
                                //console.log("err " , err, data);
                            });
                        });
                    }
                }
                    
            }else if(OBSSendON && !MIDIMapON){
                var i = typeselector(msg)
                var a = device_map.get(i)
                //console.log(JSON.stringify(a.cmds));
                //console.log(a);
                if(boll(a,msg)){
                    if(a.cmds != undefined){
                        a.cmds.forEach(function(element) {
                            ////console.log(element);
                            obs.send(element.rn, element.ar, (err, data) => {
                                //console.log(err, data);
                            });
                        });
                    }
                }
            }
            if(MIDIMapON){
                delete msg["message-id"];
                
                var i = typeselector(msg)
                var a = device_map.get(i)
                
                if(a != undefined){
                    if(boll(a,msg)){
                        mainWindow.webContents.send('MIDI_Mapping', a );
                        console.log('AAA ', a);
                    }
                }else{
                    console.log(msg);
                    mainWindow.webContents.send('MIDI_Mapping', msg );
                    device_map.set(i, msg);
                }
            }
        });  
    }
}

ipcMain.on('SaveFile', (event, data) => {
           savefile(data)
})

function savefile(data) {
    const {dialog} = require('electron') 
    const fs = require('fs') 
    console.log(data.name)
    console.log(data.path)
    console.log(data.packSize)
    dialog.showSaveDialog({ filters: [
     { defaultPath: data.path, title: data.name, name: 'zip', extensions: ['zip'] }
    ]}, function (fileName) {
    if (fileName === undefined) return;
        console.log(fileName)
        //split(data.path, data.packSize, fileName);
        fs.writeFile(fileName, data, function (err) { });
  }); 
}

function typeselector(msg){
    if(msg._type == 'cc'){
        return msg.channel + '.' + msg.controller + msg._type
    }else{
        return msg.channel + '.' + msg.note + msg._type
    }
}

function boll(a, b){
    //console.log(a);
    if(a != undefined && b != undefined){
        if(a.channel == b.channel && a.note == b.note && a._type == b._type){
            return true
        }else{
            return false
        }
        
    }else{
        return false
    }
}

//rufe function mit hilfe eines Strings aus einm JSON File auf
console.log(MD[jsonFNtest.fn]())

function splitString(stringToSplit, separator) {
  var arrayOfStrings = stringToSplit.split(separator);
    return arrayOfStrings
    
  console.log('The original string is: "' + stringToSplit + '"');
  console.log('The separator is: "' + separator + '"');
  console.log('The array has ' + arrayOfStrings.length + ' elements: ' + arrayOfStrings.join(' / '));
}

var ffpk = MIDImapping.get("0")
//console.log(ffpk);

function testing(msg){
    
    var i = msg.channel + '.' + msg.note + msg._type
    var a = MIDImapping.get(i)
   
    //console.log('Testing msg = ' + msg.channel)
    //console.log('Testing a = ' + a.channel)
    
    if(boll(a,msg)){
            //console.log('Testing msg Check= ' + a)
            
            a.cmds.forEach(function(element) {
                //console.log(element);
            });
            
        }
}



MD.setDevice();
MD.ActivMap("Akai_APC20");
MD.ActivMap("TouchOSC_Bridge");