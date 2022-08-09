const socket = io('/')
const stunServer = new Peer({
  'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }],
  'sdpSemantics': 'unified-plan'
})
const ui = document.getElementById('video-grid')

stunServer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

stunServer.on('call', call => {
  call.on('stream', stream => {

    const video = document.createElement('video')
    video.controls = true;
    video.autoplay = true;
    video.srcObject = stream
    /*
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    */
    ui.append(video)
  })
  call.answer()
})