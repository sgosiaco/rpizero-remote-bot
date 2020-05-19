<template>
  <q-page class="flex flex-center">
    <q-btn @click="connect" v-if="!connected">Connect!</q-btn>
    <div id="video-box">
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  created: function () {
    this.$options.sockets.onmessage = (data) => console.log(data.data)
  },
  mounted: function () {
    const player = document.createElement('script')
    player.setAttribute('src', 'https://cdn.jsdelivr.net/gh/matijagaspar/ws-avc-player@master/lib/WSAvcPlayer.js')
    document.head.appendChild(player)
    const hotkeys = document.createElement('script')
    hotkeys.setAttribute('src', 'https://unpkg.com/hotkeys-js/dist/hotkeys.min.js')
    document.head.appendChild(hotkeys)
  },
  methods: {
    send (message) {
      this.$socket.send(this.text)
    },
    connect () {
      // Create h264 player
      // eslint-disable-next-line
      var wsavc = new WSAvcPlayer.default({ useWorker: false })
      document.getElementById('video-box').appendChild(wsavc.AvcPlayer.canvas)
      console.log(wsavc.AvcPlayer.canvas)
      // expose instance for button callbacks
      window.wsavc = wsavc
      var uri = 'ws://rpizero1.local:3000/'
      wsavc.connect(uri)

      wsavc.on('disconnected', () => {
        console.log('WS Disconnected')
        this.connected = false
        document.getElementById('video-box').innerHTML = ''
      })
      wsavc.on('connected', () => {
        console.log('WS connected')
        this.connected = true
      })

      wsavc.on('stream_active', active => console.log('Stream is ', active ? 'active' : 'offline'))
      wsavc.on('custom_event_from_server', event => console.log('got event from server', event))

      // eslint-disable-next-line no-undef
      hotkeys('w,a,s,d,q,e', (event, handler) => {
        this.$socket.send(handler.key)
      })
    }
  },
  data () {
    return {
      connected: false,
      text: '',
      camView: ''
    }
  }
}
</script>
