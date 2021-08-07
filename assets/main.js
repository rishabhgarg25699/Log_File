(function () {
    var socket = io.connect("http://localhost:5000"); 
    var logData = document.getElementById("logs"); 
    socket.on("changedlogs", function(data){
      if(data) {
        var outputData = "";
        var size = data.data.length;
  
        for(var i = 0; i < size; i++) {
          outputData += "<div>" + data.data[i] + "</div>";
        }
  
        logData.innerHTML +=  outputData;
      }
    });
  })();