  const electron = require('electron');
    const {ipcRenderer} = electron;
    

var conf = ipcRenderer.sendSync('NC_GET_CONF')
 
var conlist = [];
var ix = 0;
var data1 = "";
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
    
    conlist = [];
    ix = 0;
});

ipcRenderer.on('MIDI_Mapping', function(event, data){
    
    console.log('MIDI_Mapping');
    console.log(data);
    
    
   
});


$( "#obssave" ).click(function() {
      var ip = $( "#networkSectionIpAddress" ).val();
  console.log('hallo');

    
    send('OBC','obsnet', {'ip': ip, 'pass': '123123' });
    send('OBC_CONNECT');
    //ipcRenderer.send('OBC_CONNECT' , () => {})
  });    

$( "#replay_buffer" ).click(function() {
    console.log('switch');
    var checkbox = $('input[type=checkbox]').prop('checked')
    var buffertime = $( "#buffertime" ).val();
    var bufsavet = $( "#bufsavet" ).val();   
    send('OBC','replay', {'check': checkbox, 'buffertime': buffertime, 'bufsavet': bufsavet });
    if(checkbox){
       console.log('True'); 
        send('OBC_CMD','StartReplayBuffer', {});
    }else{
       console.log('False'); 
        send('OBC_CMD','StopReplayBuffer', {});
    }
});

$( "#replaystart" ).click(function() {
    var buffertime = $( "#buffertime" ).val();
   var bufsavet = $( "#bufsavet" ).val();
    send('OBC','replay', {'buffertime': buffertime, 'bufsavet': bufsavet });
      
   send('OBC_REPLAY');
    
  });

$( "#conn_switch" ).click(function() {
    var checkbox = $('input[type=checkbox]').prop('checked')
    if(checkbox){
       console.log('True'); 
        send('OBC_CONNECT');
    }else{
       console.log('False'); 
        send('OBC_DC');
    }
    
  });

    
function send(name,cmd,d){
    ipcRenderer.send(name, {'cmd': cmd, 'd': d } , () => { 
            console.log("Event sent."); 
        })
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
           var sourcesmapObj = {sourcename:element.name,sourcevol:element.volume, sourcerender: element.render, vissourcename: "vis" + element.name, visbol: visbol};
           
             var source = replaceAll(model.source,sourcesmapObj );
           sourcelist.push(source);
        }); 
      }
        
   console.log('HTML Model Test === ' + model);
    var mapObj = {ix:ix,data:data.name, idinput: "but" + data.name, sources: sourcelist};
    var scene = replaceAll(model.html,mapObj );
    ix++
    //console.log(testing)
    conlist.push(scene);
    
    $(name).html(conlist);
	checkboxBSC = $('form input[type=checkbox]:checked').val();
    //console.log(checkboxBSC)
    scrolldown()
};
     //model = model.toString()
    

 


function replaceAll(str,mapObj){
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

    return str.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
    });
}

function scrolldown() {
	var elem = document.getElementById('ergebnis');
	elem.scrollTop = elem.scrollHeight;
}

function listdel() {
    data1 = "";
    conlist = [];
    ix = 0;
    console.log(data1 + ix);
    $('#ergebnis').html(data1);
}


$( "#buffertime" ).val(conf.replay.buffertime);
$( "#bufsavet" ).val(conf.replay.bufsavet);
$( "#networkSectionIpAddress" ).val(conf.obsnet.ip);