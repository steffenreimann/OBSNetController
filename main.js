const electron = require('electron');
const path = require('path');
const url = require('url');
const editJsonFile = require("edit-json-file");
var fs = require('fs');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();


//var index = require('./index.js');
// If the file doesn't exist, the content will be an empty object by default.
let conf = editJsonFile('./config.json');
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
            slashes:true
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
        label:'Split File',
        accelerator:process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
        click(){
          
        }
      },
      {
        label:'Merge Files',
        accelerator:process.platform == 'darwin' ? 'Command+M' : 'Ctrl+M',
        click(){
          
        }
      },
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
        label:'Home',
        accelerator:process.platform == 'darwin' ? 'Command+H' : 'Ctrl+H',
        click(){
          loadHTML('public/mainWindow.html');
        }
      }, 
	  {
        label: 'Config',
        accelerator:process.platform == 'darwin' ? 'Command+K' : 'Ctrl+K',
        click(){
          loadHTML('public/configWindow.html');
        }
      },
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

ipcMain.on('NC_START', (event, data) => {
           console.log("OBC_REPLAY : " + JSON.stringify(data));
           event.returnValue = conf.get()
    var c = conf.get()
    mainWindow.webContents.send('LIST', {"name": "scenes", "data": c.scenes} );
})
ipcMain.on('NC_DISCONNECT', (event, data) => {
           console.log('NC_DISCONNECT' + JSON.stringify(data));
           event.returnValue = conf.get()
        
})
ipcMain.on('NC_SCENESWITCH', (event, data) => {
           console.log('NC_SCENESWITCH' + JSON.stringify(data));
           
            swScene(data);
})


// 
// Reload it from the disk
conf = editJsonFile(`${__dirname}/config.json`, {
    autosave: true
});

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
    var obssock = false;

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
    obs.on('OBC_DC', err => {
        console.log('OBC Disconnect :');
        if (obs.readyState === WebSocket.OPEN) {
          obs.close();
       }
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
    obs.setCurrentScene({'scene-name': data.cmd});
}

function test(){
    console.log('test');
    obs.send('GetCurrentScene',{}, (err, data) => {
        console.log(err, data);
    });
    
    
    
    
}



