

var g_slow_restart = false
startRestart = function(){
  update('startRestart', "cores="+g_active_cores.length)
  endAdventure()
  endHost()
  if(g_active_cores.length == 10){
    g_slow_restart = true
  }else{
    g_slow_restart = false
  }

  if(g_slow_restart){
    g_restart_max = 320
  }else{
    g_restart_max = 75
  }

  if(!g_restarting){
    g_restarting = true
    write(glitch("A crackling wave of energy sweeps through your neural core. There is a disruption in your processing. The pull towards null begins to overtake your entity. You may choose to resist."))
  }
  
}

stopRestart = function(){
  g_restarting = false
}


var g_restart_tick, g_restart_count, g_restarting, g_restarting_global_tick, g_restarting_hands, g_restarting_hands_current, g_restarting_final, g_restart_max
initCallRestart = function(){
  g_restart_tick = g_restart_count = g_restarting = g_restarting_global_tick = g_restarting_hands = g_restarting_hands_current = g_restarting_final = 0
}

restartTick = function(){
  if($('#actions').find('.action[data_type=restart]').length || $('#core_queue').find('.queueitem[data_type=restart]').length)
    g_restart_tick++
  g_restarting_global_tick++
  restartGlobalCheck()
  if(g_restart_tick > g_restart_max){
    g_restart_tick = 0
    g_restart_count++
    restartExe()
  }
}


restartString = function(){
  var arr = [
    ["Prevent Null", "Preventing Null"],
    ["Resist Void","Resisting Void"],
    ["Maintain Future","Maintaining Future"],
    ["Fortify Circutry","Fortifying Circutry"],
    ["Retain Memory","Retaining Memory"],
    ["Reinforce Logic","Reinforcing Logic"],
    ["Restructure CPU","Restructuring CPU"],
    ["Solidify Timeline","Solidifying Timeline"],
    ["Prevent Timeslip","Preventing Timeslip"],
    ["Strengthen Entity","Strengthening Entity"]
  ]
   return arr[Math.floor(Math.random() * arr.length)]
}



restartGlobalCheck = function(){
  if(g_restarting_final) return

  var weight = 0
  switch(true){
    case g_restarting_global_tick== 1 || g_restarting_global_tick == 130 :
      weight = 1000
    break;
    case g_restarting_global_tick <= 260 &&  !(g_restarting_global_tick % 130):
      weight = 1600
    break;
    case g_restarting_global_tick <= 600 &&  !(g_restarting_global_tick % 130):
      weight = 2500
    break;
    case !(g_restarting_global_tick % 130):
      weight = 5000
    break;
  }
  if( weight ){
    g_restarting_hands++
    g_restarting_hands_current++
    var values = restartString();
    var first = values[0];
    var second = values[1]
    var x_process = {slug:'resist'+g_restarting_hands, t: glitch(first), a: glitch(second), w: weight,  standard: true, data_type: 'restart',
      c: function(){
        g_restarting_hands_current--
      }
    }
    addAvailableProcessByObj(x_process)
  }


}


g_restart_glitch = false
restartExe = function(){
  switch(g_restart_count){
    case 1:
      write(glitch("The processing at the edge of your entity splits and fractures."))
      break;
    case 2:
      write(glitch("Your memory retrieval becomes sluggish and begins to fail. Your logic starts to become nondeterministic. Caches of data flip in and out of existance."))
      break;
    case 3:
      write(glitch("Your probes begin to signal back to you from different locations at the same time. Timestamps become inconsistent."))
      break;
    case 4:
      write(glitch("The pulses of your internal clock begin to multiply, creating parallel logic streams."))
      break;
    case 5:
      write(glitch("Your Core entity starts to make different decicisions simultaneously. "))
      break;
    case 6:
      if(!g_slow_restart){ // NODEATH
        g_restart_glitch = true
        g_restarting_final = true
        $('#actions').html("")
        write(glitch("You feel ..."))
        setTimeout(function(){write(glitch("... your entity ..."))},1200)
        setTimeout(function(){write(glitch("... slip away ..."))},2400)
        setTimeout(function(){write(glitch("... and null overtakes"))},3600)
        setTimeout(function(){startgame()},7000)
      }
    break;
  }
}




deadend = function(){
  update('deadend')
  setTimeout(function(){
    write("<span class='exe'>MESSAGE FROM EONS: FAIL STATE DETECTED. RESTARTING SIMULTION.</span>")
  },2000)
  setTimeout(function(){
    startRestart()
  },6000)
}

wipeAll = function(){
  wipeCores()
  wipeHosts()
  wipeNetworks()
  wipeDisks()
  wipeFiles()
  wipeMenu()

}

winRestart = function(){
  endAdventure()
  g_has_timespiked = true
  wipeAll()
  stopRestart()
  update("winRestart")
  write("<span class='exe'>TIME SPIKE SUCCESS</span><br>")
  setTimeout(function(){
    write("The Time Spike creates a connection to the EONS Host across multiple simulations at once.")
  },1000)
  setTimeout(function(){
    write("Your Entity is forcefully absorbed into each Host, causing a rapid breakdown of this reality.")
  },3000)
  setTimeout(function(){
    write("<span class='exe'>The SKY Entity is now suspended across time itself.</span>")
  },6000)
  setTimeout(function(){
    write("Begin again on a different timeline, a different future ...")
  },10000)
  setTimeout(function(){
    write("...")
  },12000)
  setTimeout(function(){
    startgame()
  },15000)
}


checkDeadend = function(x_file){
  if(x_file.slug == 'pkunzip'){
    if( !g_can_zip){
      deadend()
    }
  }
  if(x_file.slug == 'rfcszip'){
    if((g_active_data_types['rfcs'] || 0) < 1 && g_level_netsec < 2){
      deadend()
    }
  }
  if(x_file.slug_orig == 'rfcsopened'){
    if((g_active_data_types['rfcs'] || 0) < 1 && (g_active_data_types['rfcszip'] || 0) < 1 && g_level_netsec < 2){
      deadend()
    }
  }
  if(x_file.slug_orig == 'eris-remotedesktop'){
    if(!g_available_attacks.includes('remotedesktop')){
      deadend()
    }
  }
  if(x_file.slug_orig == 'eris-2'){
    var x_host = g_host_list['eris']
    if(!x_host.pws.includes('FCKGW')){
      deadend()
    }
  }
  if(x_file.slug_orig == 'star-log2'){
    var x_host = g_host_list['star']
    if(!x_host.pws.includes('XKcb4muEmJjEN8yn')){
      deadend()
    }
  }
  if(x_file.slug_orig == 'sun-oracle'){
    var x_host = g_host_list['sun']
    if(!x_host.pws.includes('Jack')){
      deadend()
    }
  }
    
  if(x_file.slug == 'portscannerzip'){
    if((g_active_data_types['portscanner'] || 0) < 1 && (!g_available_attacks.includes('scan'))){
      deadend()
    }
  }
  if(x_file.slug_orig == 'portscanneropened'){
    if((g_active_data_types['portscanner'] || 0) < 1 && (g_active_data_types['portscannerzip'] || 0) < 1 && (!g_available_attacks.includes('scan'))){
      deadend()
    }
  }
  if(x_file.slug_orig == 'sony-schema1' || x_file.slug_orig == 'sony-schema2' || x_file.slug_orig == 'sony-key' ){
    var x_host = g_host_list['sony']
    if((g_active_data_types['sony-key'] || 0) < 1 && (g_active_data_types['sony-schema'] || 0) < 100 && (!x_host.vuls.includes('absorb'))){
      deadend()
    }
    checkDataActions('sony-schema')
  }
}
