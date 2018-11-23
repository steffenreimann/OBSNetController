  const electron = require('electron');
    const {ipcRenderer} = electron;
    

var conf = ipcRenderer.sendSync('NC_GET_CONF')
var OBS_F = ipcRenderer.sendSync('OBS_F')
var MIDIMapping
 var midilist = [];
var conlist0 = [];
var conlist1 = [];
var mapObj1
var ix = 0;
var data1 = "";
var model = require('./../electron/template.json');
var mapObj_option_html = []


console.log(conf);


    ipcRenderer.on('selectedFiles', function(e, data){
        console.log(data);
        $( "#out" ).val(data.path);
    });

ipcRenderer.on('DOM', function(event, data){
    console.log("DOM Event ID : " + data.id);
    console.log("DOM Event val : " + data.val);
    console.log("DOM Event show : " + data.show);
    if(data.val && data.id != undefined){
        $( data.id ).val(data.val)
        $( data.id ).html(data.val)
}
    
    
    if(data.show != undefined){
        if(data.show == true){
                $( data.id ).removeAttr( "disabled" )
           }else if(data.show == false){
               $( data.id ).attr("disabled", true);
           }
    }
    });

ipcRenderer.on('LIST', function(event, data){
    
    console.log('DATALIST');
    console.log(data);
    data.data.forEach(function(element) {
      console.log(element);
        list('#ergebnis', element)
    }); 
    
    conlist0 = [];
    ix = 0;
});

ipcRenderer.on('MIDI_Mapping', function(event, data){
    //conlist1.push(scene);
    console.log('MIDI_Mapping');
    console.log(data);
    list('#out', data)
});




$( "#obssave" ).click(function() {
      var ip = $( "#networkSectionIpAddress" ).val();
    console.log('Connect OBS IP ', ip);

    
    send('OBS','obsnet', {'ip': ip, 'pass': '123123' });
    send('OBS_CONNECT');
    //ipcRenderer.send('OBS_CONNECT' , () => {})
  });    

$( "#replay_buffer" ).click(function() {
    console.log('switch');
    var checkbox = $('input[type=checkbox]').prop('checked')
    var buffertime = $( "#buffertime" ).val();
    var bufsavet = $( "#bufsavet" ).val();   
    send('OBS','replay', {'check': checkbox, 'buffertime': buffertime, 'bufsavet': bufsavet });
    if(checkbox){
       console.log('True'); 
        send('OBS_CMD','StartReplayBuffer', {});
    }else{
       console.log('False'); 
        send('OBS_CMD','StopReplayBuffer', {});
    }
});

$( "#activ_mapping" ).click(function() {
    var checkbox = $('#activ_mapping').prop('checked')
    if(checkbox){
        send('f_mapping_start');
    }else{ 
        send('f_mapping_stop');
    }
});

$( "#replaystart" ).click(function() {
    var buffertime = $( "#buffertime" ).val();
   var bufsavet = $( "#bufsavet" ).val();
    send('OBS','replay', {'buffertime': buffertime, 'bufsavet': bufsavet });
      
   send('OBS_REPLAY');
    
  });
$( "#sendjsontest" ).click(function() {send('sendjsontest','replay');});

$( "#saveMIDIMapping" ).click(function() {
    var checkbox = $('input[type=checkbox]').prop('checked')
    if(checkbox){
       console.log('True'); 
        send('OBS_CONNECT');
    }else{
       console.log('False'); 
        send('OBS_DC');
    }
    
  });

$( "#conn_switch" ).click(function() {
    var checkbox = $('input[type=checkbox]').prop('checked')
    if(checkbox){
       console.log('True'); 
        send('OBS_CONNECT');
    }else{
       console.log('False'); 
        send('OBS_DC');
    }
    
  });
    
function send(name,cmd,d){
    ipcRenderer.send(name, {'cmd': cmd, 'd': d } , () => { 
            console.log("Event sent."); 
        })
}

function loadMIDIMapping(){
   // var conlist1 = [];
   
    //$('#out').html(conlist1);
    MIDIMapping = ipcRenderer.sendSync('MIDIMapping')
    $.each(MIDIMapping, function(i, item) {
        $.each(item, function(ii, itemm) {
            list('#out', itemm)
        });
    });
}

function saveMIDIMapping(){
    
    MIDIMapping = ipcRenderer.sendSync('MIDIMapping')
    
    $.each(MIDIMapping, function(i, item) {
        $.each(item, function(ii, itemm) {
            var midimapid = "#midimapid" + itemm.channel + itemm.note + itemm._type
           
            console.log(midimapid);
            
            var htmlString = $(midimapid).html()
            console.log(htmlString);
            var ch_cmd = document.getElementById(midimapid);
            
            ch_cmd = JSON.parse(ch_cmd.value);
            console.log(ch_cmd);
            var mapp = {channel: itemm.channel, note: itemm.note, controller: itemm.controller, velocity: itemm.velocity, _type: itemm._type, cmds: ch_cmd }
            //mapp = mapp.cmds.push(ch_cmd.value);
            
            console.log(ch_cmd.value);
            console.log(mapp);
            
            send('NC_SET_MAP','', mapp);
            //console.log(selected_option_value);
        });
    });
    
   // list('#out', data)
}

function typeselector(msg){
    if(msg._type == 'cc'){
        return msg.channel + '.' + msg.controller + msg._type
    }else{
        return msg.channel + '.' + msg.note + msg._type
    }
}

function list(name, data){
    
   var model = require('./../electron/template.json');
   //var model = model.html;
    var sourcelist = [];
   
    if(data.sources != undefined ){
       var visbol
       data.sources.forEach(function(element) {
            //model.sources.length
            console.log(element);
            if(element.render){
                visbol = 'visibility'
            }else{
                visbol = 'visibility_off'
            }
            var sourcesmapObj = {sourcename:element.name,sourcevol:element.volume, sourcerender: element.render, vissourcename: "vis" + element.name,   visbol: visbol};
           
            var source = replaceAll(model.source,sourcesmapObj );
            sourcelist.push(source);
        }); 
        console.log('HTML Model Test === ' + model);
        var mapObj = {ix:ix,data:data.name, option: data.name, idinput: "but" + data.name, sources: sourcelist};
        var scene = replaceAll(model.html,mapObj );
        conlist0.push(scene);
        $(name).html(conlist0);
      }
    
    if(data.channel != undefined ){
            var midimapid = "#midimapid" + data.channel + data.note + data._type
            var midimapval = "#midimapval" + data.channel + data.note + data._type
           
        
            //var mapObj_option = replaceAll(model.MIDIMapping, mapObj1 );

            var mapObj1 = {midimapid: midimapid, midimapouttext: JSON.stringify(data.cmds, undefined, 4) };
            var MIDI_Mapping1 = replaceAll(model.MIDIMapping, mapObj1 );
        
           // alert( 'model.MIDIMapping = ' + model.MIDIMapping);
            //alert( 'data.cmds = ' + data.cmds);
           // alert( 'FIND MIDI_Mapping1 = ' + MIDI_Mapping1);
        
            var mapObj = {ix:data.note,option: ' Channel: ' + data.channel + ' // Note: ' + data.note + ' // CMD: ' + data._type + '' + MIDI_Mapping1, idinput: 'blnk' + data.channel + data.note + data._type, sources: '' };
            var scene = replaceAll(model.html,mapObj );
        
        console.log(data); 
        
        
        if(findInArray(conlist1, scene)){
            var id = "#blnk" + data.channel + data.note + data._type
            console.log('HTML id = ' + id);
            
            if(data._type == 'noteoff'){
                    scrolldown(id)
               }
            
            $(id).addClass("list-group-item-success");
            //$(id).css({"background-color": "blue", "font-size": "100%"});
            setTimeout(function(){ 
               //$(id).css({"background-color": "red", "font-size": "100%"});
                $(id).removeClass("list-group-item-success");
            }, 500);
            
            
           }else{
                conlist1.push(scene);
                $(name).html(conlist1);
               
               
           }
         
        //document.getElementById(midimapid).value = data.cmds;
    }; 
        
    

    
    ix++
    //console.log(testing)
   
    
	checkboxBSC = $('form input[type=checkbox]:checked').val();
    //console.log(checkboxBSC)
    
};
     //model = model.toString()
    

// function to search array using for loop
function findInArray(ar, val) {
    for (var i = 0,len = ar.length; i < len; i++) {
        if ( ar[i] === val ) { // strict equality test
            //return i;
            return true;
        }
    }
    //return -1;
    return false;
}

function replaceAll(str,mapObj){
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

    return str.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
    });
}

function scrolldown(q) {
    var pos = $(q).position();    
    document.documentElement.scrollTop = document.body.scrollTop = pos.top;
}


function listdel() {
    conlist1 = [];
    
    $('#out').html(conlist1);
}
function test(){
    console.log("Hallo ich bin der test");
}
  
 

//loadMIDIMapping();
$( "#buffertime" ).val(conf.replay.buffertime);
$( "#bufsavet" ).val(conf.replay.bufsavet);
$( "#networkSectionIpAddress" ).val(conf.obsnet.ip);