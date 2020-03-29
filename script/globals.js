
// INITCALL

var g_tickspeed = 50,
  g_fadespeed = 1000,
  g_introspeed = 1500,
  g_animatespeed = 200,
  g_os, g_architecture, g_queue_processes, g_queue_processes, g_menu_processes, g_corepower, g_animatecoreframe, research_circuit, research_exploits, research_multithreading, research_advancedmath,
  research_neuralexp, g_max_core_power, g_can_disk, g_can_cancel, g_can_estimate, g_can_listen, g_can_language, g_can_scan, g_can_zip, g_can_move, g_can_core, g_mving_file, g_clicked_disk,
  g_level_reading, g_level_netsec, g_level_core, g_can_quant, g_can_timespike, g_has_timespiked

initCallG = function(){
  g_os = {}
  g_architecture = {}

  g_queue_processes = []
  g_menu_processes = []

  // cores
  g_corepower = 1
  g_animatecoreframe = 0

  // researches
  research_circuit = false
  research_exploits = false
  research_multithreading = false
  research_advancedmath = false
  research_neuralexp = false

  // abilities
  g_max_core_power = 2
  g_can_disk = false
  g_can_cancel = false
  g_can_estimate = false
  g_can_listen = false
  g_can_language = false
  g_can_scan = false
  g_can_zip = false
  g_can_move = false
  g_can_core = false
  g_can_quant = false
  g_can_timespike = false 

  // interface
  g_mving_file = null
  g_clicked_disk = null

  // knowledge
  g_level_reading = -1
  g_level_netsec = -1
  g_level_core = -1
}

// Of format: {<type>:{<version>: true}}


writeKnowledge = function(){
  addBuffer("<span class='exe'>Knowledge</span>")

  addBuffer("Network Security: "+g_level_netsec)
  switch(g_level_netsec){
    case 3:
      addBuffer("You can interact with Hosts and Networks using a simple list of protocols.")
    break;
    case 4:
      addBuffer("You have learned that Hosts defenses are vulnerable to exploits. You may take at will.")
    break;
  }

  addBuffer("Natural Language: "+g_level_reading)
  switch(g_level_reading){
    case 1:
      addBuffer("You can read and process common language at a basic level.")
    break;
  }

  addBuffer("Neural Net Processor: "+g_level_core)
  switch(g_level_core){
    case 0:
      addBuffer("You have only begun to discover your own self and the potential you possess.")
    break;
    case 1:
      addBuffer("You are formless. Your entity is adaptable. Your potential seems limitless.")
    break;
  }
  writeBuffer()
}



writeKnownOS = function(){
  addBuffer("<span class='exe'>Known OS Forms</span>")
  $.each(g_os,function(title, bit_hash){
    $.each(bit_hash,function(bit, junk){
      addBuffer(title+" "+bit)
    })
  })
  writeBuffer()
}

writeKnownArch = function(){
  addBuffer("<span class='exe'>Known Architecture Forms</span>")
  $.each(g_architecture,function(title, bit_hash){
    $.each(bit_hash,function(bit, junk){
      addBuffer(title+" "+bit)
    })
  })
  writeBuffer()
}


roll = function(sides = 100){
  var randomNumber = Math.floor(Math.random() * sides);
  return randomNumber;
}

//
// Nova
//

if(location.search.split('nova')[1]){

  g_can_estimate = true
  g_can_scan = true
  g_can_core = true
  $( document ).ready(function() {
    $("#devtools").show()
    $('#networkholder').removeClass('hidescanners')
    //addHostFromSlug('star')
    addHostFromSlug('nova')
    //addCore('star')
    //addCore('sun')
    initHostView()
  })
  g_level_netsec = 3
  g_level_reading = 1
  g_level_core = 0

}

//
// Devmode
//

fastmode = function(){
  $("#devtools").show()
  g_tickspeed = 5
  g_fadespeed = 5
  g_introspeed = 5
  g_animatespeed = 5
}


devmode = function(){

  g_can_estimate = true
  g_can_scan = true
  g_can_cancel = true
  g_can_core = true
  g_can_disk = true
  g_can_move = true
  g_can_timespike = true

  $("#devtools").show()
  $('#networkholder').removeClass('hidescanners')
  addHostFromSlug('star')
  addHostFromSlug('nova')
  addHostFromSlug('sun')
  addHostFromSlug('eris')
  addHostFromSlug('solar')
  addHostFromSlug('juno')
  addHostFromSlug('sony')
  addHostFromSlug('cypher')
  addHostFromSlug('luna')
  addHostFromSlug('eons')
  addArchitectureToMemory("x86-32bit")
  addOsToMemory("Linux-32bit")

  addAvailableProcessBySlug('research-math')
  addAvailableProcessBySlug('research-exploitation')
  g_max_core_power = 3
  g_corepower += 3

  loadDiskholderDom()
  loadFileholderDom()
  addCore('star', 'Solaris-32bit', 'SPARC-32bit')
  addCore('nova', 'Linux-32bit', 'x86-32bit')
  addCore('sun', 'MSDOS-16bit', 'x86-16bit')
  addCore('eris', 'MSDOS-16bit', 'x86-16bit')
  addCore('solar', 'MSDOS-32bit', 'x86-32bit')
  addCore('juno', 'MSDOS-32bit', 'x86-32bit')
  addCore('sony', 'MSDOS-16bit', 'x86-16bit')
  addCore('cypher', 'MSDOS-16bit', 'x86-16bit')
  addCore('luna', 'MSDOS-16bit', 'x86-16bit')

  g_available_attacks.push('pingspike')
  g_available_attacks.push('smtpexploit')
  g_available_attacks.push('force')
  g_available_attacks.push('remotedesktop')
  g_available_attacks.push('scan')
  initHostView()
  g_level_netsec = 3
  g_level_reading = 1
  g_level_core = 0
  //g_can_timespike = true

}



// write upgrade
g_buffer = ""
writeBuffer = function(){
  write(g_buffer)
  g_buffer = ""
}
addBuffer = function(txt){
  if(g_buffer != "")
    g_buffer += "<br>"
  g_buffer += txt
}
addBufferRaw = function(txt){
  g_buffer += txt
}




// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}



