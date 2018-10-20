const electron = require('electron');
const path = require('path');
const url = require('url');
const editJsonFile = require("edit-json-file");
var fs = require('fs');
//var index = require('./index.js');
// If the file doesn't exist, the content will be an empty object by default.
let config_file = editJsonFile(`${__dirname}/config.json`);
try {
'use strict';
var os = require('os');
var ifaces = os.networkInterfaces();
var port = "8081"
} catch (ex) {
    console.log(ex);
   // console.log(ex.code)
    if(ex.code == 'MODULE_NOT_FOUND'){
	    console.log('MODULE_NOT_FOUND')
	    //exec("npm install ", puts);
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
//Lese Aus der JSON Datei wlchen wert firststart hat 
console.log(config_file.get("firststart"));
if(config_file.get("firststart") == true) {
	console.log("Erster Start wird ausgeführt");
	// Load html in window
	  mainWindow.loadURL(url.format({
	    pathname: path.join(__dirname, 'public/electron/configWindow.html'),
	    protocol: 'file:',
	    slashes:true
	  }));
    }else{
	   console.log("Erster Start wurde bereits ausgeführt");
	// Load html in window
	   mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'public/electron/mainWindow.html'),
            protocol: 'file:',
            slashes:true
	  }));
}
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
var config = config_file.toObject()
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
	config_file.set(data.name, data.val);
}
ipcMain.on('DOM', (event, data) => {
           console.log("DOM Data : " + data);
})
// Output the content
console.log(config_file.get());
// { planet: 'Earth',
//   name: { first: 'Johnny', last: 'B.' },
//   is_student: false }
// Save the data to the disk
//config_file.save();
// 
// Reload it from the disk
config_file = editJsonFile(`${__dirname}/config.json`, {
    autosave: true
});
setJSON({name: "username", val: "Steffen"})
 // Output the whole thing
//console.log(config_file.toObject());
// { planet: 'Earth',
//   name: { first: 'Johnny', last: 'B.' },
//   is_student: false,
//   a: { new: { field: [Object] } } }