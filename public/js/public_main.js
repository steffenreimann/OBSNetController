  const electron = require('electron');
    const {ipcRenderer} = electron;
    const ul = document.querySelector('ul');

var conlist = [];
var ix = 0;
var data1 = "";

    ipcRenderer.on('selectedFiles', function(e, data){
        console.log(data);
        $( "#out" ).val(data.path);
    });

    ipcRenderer.on('item:clear', function(){
      ul.className = '';
      ul.innerHTML = '';
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
        list('#ergebnis', element.name)
    });
     
    });

   // ul.addEventListener('dblclick', removeItem);
  
      
    function removeItem(e){
      console.log('hallo');
    }
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




  
ipcRenderer.on('start', (event, data) => { 
    console.log(data); 
    console.log(event); 
    console.log("data.replay.buffertime = " + data.replay); 
    $( "#buffertime" ).val(data.replay.buffertime);
   $( "#bufsavet" ).val(data.replay.bufsavet);
    
})

var options =  { 
            onKeyPress: function(cep, event, currentField, options){
           console.log('An key was pressed!:', cep, ' event: ', event,'currentField: ', currentField, ' options: ', options);
                if(cep){
                  var ipArray = cep.split(".");
                  var lastValue = ipArray[ipArray.length-1];
                  if(lastValue !== "" && parseInt(lastValue) > 255){
                      ipArray[ipArray.length-1] =  '255';
                      var resultingValue = ipArray.join(".");
                      currentField.attr('value',resultingValue);
                  }
            }             
        }};

//$('.ip_address').mask("000.000.000.000:00000", options);


    
function send(name,cmd,d){
    ipcRenderer.send(name, {'cmd': cmd, 'd': d } , () => { 
            console.log("Event sent."); 
        })
}

function replaceAll(str,mapObj){
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

    return str.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
    });
}

function list(name, data){
    var model = require('./../electron/template.json');
    model = model.html;
    var mapObj = {ix:ix,data:data, idinput: "but" + data};
    var testing = replaceAll(model,mapObj );
    
    ix++
    if(conlist.length > 13){
        console.log(conlist.length);
        //conlist = conlist.slice(2,14);
        
    }
    console.log(testing)
    conlist.push(testing);
    $(name).html(conlist);
	checkboxBSC = $('form input[type=checkbox]:checked').val();
    console.log(checkboxBSC)
    scrolldown()
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








 var start = ipcRenderer.sendSync('NC_START')
     console.log(start); 

 $( "#buffertime" ).val(start.replay.buffertime);
   $( "#bufsavet" ).val(start.replay.bufsavet);
 $( "#networkSectionIpAddress" ).val(start.obsnet.ip);