var express = require("express")
var fs = require("fs");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

io.on("connection", function(client) {
  console.log("Client connected is connected");
  var logFile = process.argv[2]; 

  function sendingLogs() {
    var logsData = fs.readFileSync(logFile).toString();
    var endPosition = logsData.length;

    var data = logsData.split("\n")
    var newData = data.slice((data.length-10), (data.length+1));

    goChanges(newData);

    fs.watch(logFile, function(event, fname) 
    {
      fs.open(logFile, "r", function(err, fd) 
      {
        fs.fstat(fd, function(err, fstats)
        {
          var diff = fstats.size > endPosition ? fstats.size - endPosition : 0;
          if(diff) 
          {
            var buffer = new Buffer.alloc(diff);
            fs.read(fd, buffer, 0, buffer.length, endPosition, function (err, bytes)
            {
              if(bytes > 0) 
              {
                changedContent = buffer.slice(0, bytes).toString();
                goChanges(changedContent.split("\n"));
              }
            });
            endPosition = fstats.size
          }
        })
      });
    });
  }
  sendingLogs()
  function goChanges(logs) {
    if(logs.length) 
    { 
      client.emit("changedlogs", {data: logs});
    }
  }
});

app.use("/js", express.static(__dirname + '/assets'));
app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html")
})

server.listen(5000, () => {
  console.log("Searver running at http://localhost:5000/")
}); 