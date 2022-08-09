const socket = io('/')
const stunServer = new Peer({
  'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }],
  'sdpSemantics': 'unified-plan'
})

const peers = {}
const UserGrid = document.getElementById('user-grid')

stunServer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
  console.log(ROOM_ID)
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

navigator.mediaDevices.getDisplayMedia({
  video: true,
  audio: false
}).then(stream => {
  socket.on('user-connected', userId => {
    console.log(`${userId} join`)
    connectToNewUser(userId, stream)
  })
})

function connectToNewUser(userId, stream) {
  const call = stunServer.call(userId, stream)
  peers[userId] = call
  let btn = document.createElement("button")
  btn.innerText = userId
  btn.addEventListener('click', (ev) =>{
    call.close()
    UserGrid.removeChild(btn)
  })
  UserGrid.appendChild(btn)
}
