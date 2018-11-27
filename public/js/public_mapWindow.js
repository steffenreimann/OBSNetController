  const electron = require('electron');
    const {ipcRenderer} = electron;

testubg = ipcRenderer.sendSync('MapWindowData');
console.log(testubg);


