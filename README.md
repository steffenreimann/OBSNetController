OBSNetControl ist ein Netzwerk Controller für OBS basierend auf OBS-Websockets und OBS-WebsocketJS. 
Die Electron App verbindet sich zum einem OBS-Websocket Server und bearbeitet Anfragen von MIDI Geräten oder anderen Websockets.


OBSNetControl is a network controller for OBS based on OBS-Websockets and OBS-WebsocketJS. 
The Electron App connects to an OBS websocket server and handles requests from MIDI devices or other websockets. 

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
