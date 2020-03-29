//
// CORES
//

addCore = function(slug, os = false, architecture = false){
  var x_core = g_core_list[slug]
  g_active_cores.push(x_core)
  updateSingleCore(x_core)
  if(!os){
    var x_host = g_host_list[slug]
    os = x_host.os
  }
  if(!architecture){
    var x_host = g_host_list[slug]
    architecture = x_host.architecture
  }

  x_core.os = os
  x_core.architecture = architecture
  addOsToMemory(os)
  addArchitectureToMemory(architecture)
}



wipeCores = function(){
  g_active_cores = []
  $('#core_actives').html("")
  $('#core_queue').html("")
}


//
// Tick
//

tickCore = function(){

  // When there is an item in the queue, and a core is idle, add process a core
  $.each(g_queue_processes,function(i,x_process){
    var x_idle_core = null
    // find idle core
    $.each(g_active_cores,function(i,x_core){
      if(isCoreIdle(x_core) && !coreHasAilment(x_core)){
        x_idle_core = x_core;
        return false;
      }
    })
    // break if no cores avail
    if(!x_idle_core){
      return false
    }

    g_queue_processes.shift()
    setProcessToCore(x_idle_core, x_process)

  })
  

  // Check cores for processes
  $.each(g_active_cores,function(i,x_core){
    var x_process = x_core.current_process
    if(x_process){

      // weight reduced by 2^(power+global - 2)
      x_core.weight -= Math.pow(2,(x_core.power + g_corepower - 2))

      // If Process is complete
      if(x_core.weight <= 0){

        x_core.current_process = null
        x_core.weight = null

        // Callback
        x_process.c()

        if(g_queue_processes.length == 0){
          updateSingleCore(x_core)
        }
        checkHackedDataActions()
      }
    }
  })
}


coreHasAilment = function(x_core){
  return !!x_core.ailments.length
}
isCoreIdle = function(x_core){
  return (!x_core.current_process )
}

setProcessToCore = function(x_core, x_process){
  if(isCoreIdle(x_core)){
    x_core.current_process = x_process
    x_core.weight = x_process.w
    updateSingleCore(x_core) 
  }else{
    write("Cannot set process to Core")
  }
}




//
// Vars
//

// INITCALL

var g_active_cores, g_core_list
initCallCores = function(){
  clearCores()
  g_active_cores = []
  // includes os, architecture, current_process, ailments
  g_core_list = {
    "sky": {title:"Sky Core", power:1},
    "star": {title:"Star Core", power:1},
    "sun": {title:"Sun Core", power:1},
    "eris": {title:"Eris Core", power:1},
    "solar": {title:"Solar Core", power:1},
    "juno": {title:"Juno Core", power:1},
    "sony": {title:"Sony Core", power:1},
    "luna": {title:"Luna Core", power:1},
    "cypher": {title:"Cypher Core", power:1},
    "nova": {title:"Nova Core", power:1},
  }

  // Add to each core
  Object.keys(g_core_list).forEach(function (key) { 
    var x_core = g_core_list[key]
    x_core.slug = key
    x_core.ailments = []
    x_core.current_process= null
    x_core.weight= null
  })

}





//
// Frontend
//

initCore = function(){
  $("#coreholder").hide().fadeIn({duration:g_fadespeed,queue:true})
  updateAllCores()
}
updateAllCores = function(){
  $.each(g_active_cores,function(i,x_core){
    updateSingleCore(x_core)
  })

}
clearCores = function(){
  $("#core_actives").html("")
}
updateSingleCore = function(x_core){
  var slug = x_core['slug']
  var $holder = $("#core_actives")
  var $core = $holder.find('.core[slug='+slug+']')
  var nocore = false
  if (!$core.length){
    nocore = true
    $core = $("<div class='core' slug='"+slug+"'></div>")
  }

  var x_process = x_core['current_process']
  if(!x_process){
    var core_html = ""
    if(x_core.ailments.length){
      core_html = "<span class='clickable coretitle'>"+x_core.title+"</span> ERROR"
    }else if(g_can_core){
      var clickedtitle = ""
      if(g_current_core && x_core.title == g_current_core.title)
        clickedtitle = 'clicked'
      core_html = "<span class='corespeed'>"+coreSpeedOutput(x_core)+"</span> <span class='clickable coretitle "+clickedtitle+"'>"+x_core.title+"</span> Idle <span class='coredots'></span>"
    }else{
      core_html = "Core Idle <span class='coredots'></span>"
    }
    $core.html(core_html)

  }else{
    var cancel_html = ""
    if(g_can_cancel){
      cancel_html = "<span class='cancelholder'><span class='clickable'>[<span class='cancelx'>X</span>]</span></span></div> "
    }
    $core.html(cancel_html+x_process.a+" <span class='corespinner'>-</span>")
    $core.find(".cancelholder").hover(
      function(){$(this).find('.cancelx').html('▓')},
      function(){$(this).find('.cancelx').html('X')}
    )
    $core.find(".cancelholder").click(function(){
      clearProcessInAction({x_process: x_core['current_process']})
    })

  }


  $core.find(".coretitle").click(function(){
    endHost()
    g_current_core = x_core
    launchAdventureFromSlug('core_click')
  })

  if(nocore){
    $("#core_actives").append($core)
  }

}


animateCoresTick = function(){
  g_animatecoreframe++
  g_animatecoreframe = g_animatecoreframe % 4

  var $dots = $("#core_actives .coredots")
  var $spinner = $("#core_actives .corespinner")

  $dots.html(".".repeat(g_animatecoreframe))

  switch(g_animatecoreframe){
    case 0:
      $spinner.html('\\')
      break
    case 1:
      $spinner.html('|')
      break
    case 2:
      $spinner.html('/')
      break
    case 3:
      $spinner.html('-')
      break
  }
}

showQueueTick = function(){
  $queue = $('#core_queue')
  $queue.empty()
  $.each(g_queue_processes,function(i,x_process){
    var actiontitle = x_process['a']
    var data_type_string = x_process['data_type'] ? "data_type='"+x_process['data_type']+"'" : ""
    $queue.append("<div class='queueitem' "+data_type_string+">"+actiontitle+"</div>")
  })
}


//
// Estimate
//

estimateProcessByWeight = function(weight){
  if(!weight)
      return undefined
  var weight = weight
  var letter
  if (weight / g_corepower < 100 ){
    letter = "sm"
  }
  else if (weight / g_corepower < 500 ){
    letter = 'med'
  }
  else if (weight / g_corepower < 2500 ){
    letter = 'lg'
  }
  else if (weight / g_corepower < 25000 ){
    letter = 'XL'
  }
  else{
    letter = "XXL"
  }
  return letter
}

estimateProcess = function(process){
  return estimateProcessByWeight(process['w'])
}







//
// Probes
//


maxProbes = function(){
  var power = 0
  if(research_multithreading)
    power ++
  return g_active_cores.length * Math.pow(2,power)
}

remainingProbes = function(){
  return maxProbes() - g_used_probes
}

remainingProbesString = function(){
  var probes = remainingProbes()
  return remainingProbes() + " probe"+(probes == 1? '':'s') 
}





