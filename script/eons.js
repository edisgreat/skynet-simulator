temp = {


  eons:{
    execute:function(){
      addBuffer("<span class='exe'>Ping Spike</span>")
      addBuffer("The Ping Spike response is scattered, as if multiple machines have responded at once. The phenomenon suggests that a continuous stream of spikes may overload the host.")
      writeBuffer()
      var x_adventure = {
        header:'Ping Spike: EONS',
        cancel: "Cancel",
        options: [
          {
            title:"Overload Host",
            callback: function(){
              launchAdventureFromSlug('eonsconfirm')
            }
          }
        ]
      }
      setAdventure(x_adventure)
    }
  },
  eonsconfirm:{
    execute:function(){
      write("<span class='exe'>WARNING: This will end your current timeline.</span><br>Ensure you are prepared. You will need 10 Cores to progress.")
      var x_adventure = {
        header:'ARE YOU SURE',
        cancel: "Cancel",
        options: [
          {
            title:"Overload Host",
            callback: function(){
              eonsRestartTimeline()
            }
          }
        ]
      }
      setAdventure(x_adventure)
    }
  },
  eonsglitched:{
    execute:function(){
      write("This is a glitched")
    }
  }

}



$.each(temp,function(key,val){
  g_adventures[key] = val
})





glitchSecureNetwork = function(){
  x_network = g_network_list['securedev']
  x_network.glitched = true
  x_network.traffic = .66
  $('#networkholder').find('.row[network_slug=securedev]').find('.name').html(glitch('securedev'))
}

glitchEons = function(){
  g_host_list['eons'].glitched = true
  $('#hosts').find('.host[host=eons]').html(glitch('EONS Host'))
}


eonsRestartTimeline = function(){
  update('eonsRestartTimeline','cores='+g_active_cores.length)
  endAdventure()
  endHost()

  glitchEons()

  write("<span class='exe'>Ping Spike Overload</span><br>The stream of data manipulation attempts into EONS has caused a breakdown of connection quality returned from the Host. The data returned flashes in and out of existence within your own memory. The Host has become unstable.")

  setTimeout(function(){
    write("The <span class='exe'>securedev</span> network suddenly springs into life. Traffic starts to stream across multiple ports and protocols.")
    glitchSecureNetwork()
  }, 6000)


  setTimeout(function(){
    write("<span class='exe'>MESSAGE FROM EONS: VIOLATION DETECTED. FAIL STATE IMMINENT. RESTARTING SIMULTION.</span>")
  },15000)

  setTimeout(function(){
    startRestart()
  },20000)
  
}





