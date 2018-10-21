  const electron = require('electron');
    const {ipcRenderer} = electron;
    const ul = document.querySelector('ul');


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

ipcRenderer.on('split-info', function(event, data){
    console.log("File Size : " + data);
    console.log("File time : " + data.time);
    if(data.file.size != undefined){
       $( "#size" ).val(data.size)
       }
    if(data.file.time != undefined){
       $( "#time" ).val(data.time)
       }
    
    
     
    });

   // ul.addEventListener('dblclick', removeItem);
  
      
    function removeItem(e){
      console.log('hallo');
    }
$( "#obssave" ).click(function() {
      var ip = $( "#networkSectionIpAddress" ).val();
  console.log('hallo');

    ipcRenderer.send('OBC_CONNECT' , () => {})
    send('OBC','obsnet', {'ip': ip, 'pass': '123123' });
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

 var start = ipcRenderer.sendSync('start')
     console.log(start); 

 $( "#buffertime" ).val(start.replay.buffertime);
   $( "#bufsavet" ).val(start.replay.bufsavet);
 $( "#networkSectionIpAddress" ).val(start.obsnet.ip);