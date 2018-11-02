OBSNetControl ist ein Netzwerk Controller für OBS basierend auf OBS-Websockets and OBS-WebsocketJS. 
Die Electron App soll sich zum einem OBS-Websocket Server verbinden und Anfragen aus der App oder über eine Weboberfläche bearbeiten können.


OBSNetControl is a network controller for OBS based on OBS-Websockets and OBS-WebsocketJS. 
The Electron App should connect to an OBS-Websocket server and be able to process requests from the app or via a web interface. 

# Download 

[Download OBSNetControl Build macOS](https://github.com/steffenreimann/OBSNetController/releases/download/0.1-macOS/OBSNetControl-darwin-x64.zip)


[Download OBSNetControl Build Windows](https://github.com/steffenreimann/OBSNetController/releases/download/0.1-win64/OBSNetControl-win32-x64.zip)

# Install for developing or build yourself



```
1.Clone repo

git@github.com:steffenreimann/OBSNetController.git
``` 

```
2.go into the Folder

cd OBSNetController
``` 

```
3.

npm install
``` 

```
4.

npm run rebuild
``` 
```
5. Build for your OS

npm run package-mac
or
npm run package-win
or
npm run package-linux
``` 



https://github.com/nodejs/node-gyp#installation

https://www.npmjs.com/package/electron-rebuild
