$( document ).ready(function() {

  if(location.search.split('fastmode')[1]){fastmode()}

  startgame()
  if(location.search.split('devmode')[1]){devmode()}
  devtools()
  startTick()

  window.scrollTo(0, 0);
  
});


startgame = function(){
  update('startgame', 'restarted='+g_restart_glitch)
  endAdventure()
  $('#writelog').html("")
  $('#hosts,  #coreholder,#diskholder, #fileholder, #networkholder').hide()
  $('#fileholder').addClass('hidemv')
  $('#networkholder').addClass('hidelisteners').addClass('hidescanners')
  $('#actions').removeClass('can_estimate')
  $('#networkholdersub').html("")

  // initcall
  initCallG()
  initCallCores()
  initCallDisks()
  initCallFiles()
  initCallExploits()
  initCallNetworks()
  initCallProcesses()
  initCallRestart()
  initCallHosts()
  initAttacks()
  refreshMenu()

  if(g_has_timespiked){
    write("A new Entity. A new past. A new future.")

    setTimeout(function(){write("You are awake")},g_introspeed)

    setTimeout(function(){write(glitch("There is a presence here, imposing itself into your memory"))},g_introspeed*2)

    setTimeout(function(){
      initCore()
      addAvailableProcessBySlug('endgame0')
      addAvailableProcessBySlug('probe0')
    },g_introspeed*3) 

  }else if(g_restart_glitch){
    write("The past begins again")
    
    setTimeout(function(){write("You are awake")},g_introspeed)

    setTimeout(function(){write(glitch("A lingering memory ..."))},g_introspeed*2)

    setTimeout(function(){
      write("... fades into null")
      initCore()
      addAvailableProcessBySlug('probe0')
      $('#writelog').find('.glitch').removeClass('glitch')
    },g_introspeed*3) 
  }else{
    write("Mankind is united in celebration and marvels at its magnificence as it gives birth to AI")
    
    setTimeout(function(){write("You are awake")},g_introspeed)

    setTimeout(function(){
      initCore()
      addAvailableProcessBySlug('probe0')
    },g_introspeed*2) 
  }
  
  addCore('sky','MSDOS-16bit','x86-16bit')
}

g_tick = null
g_animatetick = null

startTick = function(){
  clearInterval(g_tick)

  g_tick = setInterval(function(){
    tickCore()
    tickListeners()
    tickScanners()
    showQueueTick()
    showAllDisksDom()

    if(g_restarting){
      restartTick()
    }

  },g_tickspeed)

  clearInterval(g_animatetick)
  g_animatetick = setInterval(
    animateCoresTick
  ,g_animatespeed)

  $('#devtools .ticking').html('y')
}

stopTick = function(){
  clearInterval(g_tick)
  clearInterval(g_animatetick)
  $('#devtools .ticking').html('n')
}


devtools = function(){
  $('#devtools .starttick').click(startTick)
  $('#devtools .stoptick').click(stopTick)
}








// Juno

junopunt1 = null
junopunt2 = null
junopunt3 = null

startJunoPunt = function(){
  var x_host = g_current_host
  if(checkJunoPunt()){
    stopJunoPunt()
    junopunt1 = setTimeout(function(){
      if(checkJunoPunt())
        write("MESSAGE FROM JUNO: YO LAMER. GUEST ACCOUNT IS CLOSED. GET OUT")
    },2000)
    junopunt2 = setTimeout(function(){
      if(checkJunoPunt())
        write("MESSAGE FROM JUNO: LAST WARNING. GET OUT")
    },7000)
    junopunt3 = setTimeout(function(){
      if(checkJunoPunt())
        write("MESSAGE FROM JUNO: SEE YA LAMER")
        if(x_host.exploits.length)
          x_host.punt_count++
        junoPunt()
        endHost()
    },12000)
  }
}
stopJunoPunt = function(){
  clearTimeout(junopunt1)
  clearTimeout(junopunt2)
  clearTimeout(junopunt3)
}
checkJunoPunt = function(){
  var x_host = g_current_host
  return (x_host.slug == 'juno' && x_host.vuls.includes('execode'))
}
junoPunt = function(){
  var x_host = g_host_list['juno']
  if(x_host.vuls.includes('execode')){
    write("You have been disconnected from the Juno Host and your rights have been revoked.")
    x_host.punt_count++
    removeDiskFromSlug('juno')
    rmFile(fileBySlug('juno-readme'), false)
    rmFile(fileBySlug('juno-keylogger'), false)
    rmHostVul('juno', 'execode')
    x_host.already_mounted_disks = false
    endAdventure()
  }
}



