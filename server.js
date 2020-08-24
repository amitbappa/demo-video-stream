const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const YT_API_KEY='AIzaSyCG25IwSEZcJuF5Te7kko9XawkHaEJ48Ws'
var YT_VIDEO_ID=''

io.on('connection', (socket) => {
  socket.on('join', (roomId) => {
    const roomClients = io.sockets.adapter.rooms[roomId] || { length: 0 }
    const numberOfClients = roomClients.length

    // These events are emitted only to the sender socket.
    if (numberOfClients == 0) {
      YT_VIDEO_ID='F5UPc8dya-M'
      console.log(`Creating room ${roomId} and emitting room_created socket event`)
      socket.join(roomId)
      socket.emit('room_created', {roomId,YT_API_KEY})
    } else if (numberOfClients == 1) {
      console.log(`Joining room ${roomId} and emitting room_joined socket event`)
      socket.join(roomId)
      socket.emit('room_joined', {roomId,YT_API_KEY})
    } else {
      console.log(`Can't join room ${roomId}, emitting full_room socket event`)
      socket.emit('full_room', roomId)
    }
  })

  // These events are emitted to all the sockets connected to the same room .
 
  socket.on('set_current', function(data) {
            console.log(`Broadcasting set_current event to peers in room ${data.roomId}`)

        io.sockets.in(data.roomId).emit('play_video',{roomId:data.roomId,yt_video_id:YT_VIDEO_ID,isRoomCreator:true})
    })

    socket.on('get_current', (roomId)=> {
            console.log(`Broadcasting get_current event to peers in room ${roomId}`)
          io.sockets.in(roomId).emit('play_video',{roomId:roomId,yt_video_id:YT_VIDEO_ID,isRoomCreator:false})
    })
})

// START THE SERVER =================================================================
const port = process.env.PORT || 5000
server.listen(port, () => {
  console.log(`Express server listening on port ${port}`)
})
