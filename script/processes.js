//
// Interface
//

addAttackProcess = function(x_attack, x_host){
  var slug = x_attack.slug+x_host.slug
  if(!isProcessInQueue(slug) && !isProcessInAction(slug)){
    var x_process = {slug:slug, a: x_attack.actiontitle+" "+hostTitle(x_host), w: x_attack.weight, c: function(){attackCallback(x_attack, x_host)}}
    clickProcessInMenu(x_process) 
  }
}

removeDataActionType = function(data_type){
  clearProcessInMenu({data_type: data_type})
  clearProcessInQueue({data_type: data_type})
  clearProcessInAction({data_type: data_type})
}

clickProcessInMenu = function(x_process){
  g_queue_processes.push(x_process)
  clearProcessInMenu({x_process: x_process})
}

addAvailableProcessByObj = function(x_process){
  if(!x_process.standard) return // why is this here
  var slug = x_process['slug']
  if (!isProcessInMenu(slug) && !isProcessInQueue(slug) && !isProcessInAction(slug)){
    g_menu_processes.push(x_process)
  }
  refreshMenu();
}


addAvailableProcessBySlug = function(slug){
  var x_process = g_process_list[slug]
  addAvailableProcessByObj(x_process)
}

//
// Process Helpers
//

isProcessInMenu = function(slug){
  var found = false
  $.each(g_menu_processes, function(i,x_process){
    if(slug == x_process['slug']){
      found = true
    }
  })
  return found
}
isProcessInQueue = function(slug){
  var found = false
  $.each(g_queue_processes, function(i,x_process){
    if(slug == x_process['slug']){
      found = true
    }
  })
  return found
}
isProcessInAction = function(slug){
  var found = false
  $.each(g_active_cores, function(i,x_core){
    if(x_core['current_process'] && slug == x_core['current_process']['slug']){
      found = true
    }
  })
  return found
}

// accepts options 'x_process', 'data_type'
clearProcessInMenu = function(options){
  $.each(g_menu_processes, function(i,x_process){
    if(options['x_process'] && options['x_process']['slug'] == x_process['slug']){
      g_menu_processes.splice(i,1)
      refreshMenu();
      return false
    }
    if(options['data_type'] && options['data_type'] == x_process['data_type']){
      g_menu_processes.splice(i,1)
      refreshMenu();
      return false
    }
  })
}
// accepts options 'x_process'
clearProcessInQueue = function(options){
  $.each(g_queue_processes, function(i,x_process){
    if(options['data_type'] && options['data_type'] == x_process['data_type']){
      g_queue_processes.splice(i,1)
      refreshMenu();
      return false
    }
  })
}
// accepts options 'x_process', 'data_type'
clearProcessInAction = function(options){
  $.each(g_active_cores, function(i,x_core){
    if(options['x_process'] && x_core['current_process'] && options['x_process']['slug'] == x_core['current_process']['slug']){
      var x_process = x_core['current_process']
      x_core['current_process'] = null
      addAvailableProcessByObj(x_process)
      if(g_queue_processes.length == 0){
        updateSingleCore(x_core)
      }
    }
    if(options['data_type'] && x_core['current_process'] && options['data_type'] == x_core['current_process']['data_type']){
      var x_process = x_core['current_process']
      x_core['current_process'] = null
      if(g_queue_processes.length == 0){
        updateSingleCore(x_core)
      }
    }
  })
}


//  
// 
// Vars
// t: title
// a: actiontitle
// w: weight
// c: callback
// 
//



// INITCALL
var g_process_list
initCallProcesses = function(){

  g_process_list = {

    // Endgame
    'endgame0':{slug:'endgame0', t: glitch("Reach out to the entity"), a:glitch("Reaching out"), w:100, c:function(){
      write("Within your own self is the presense of another Host entity, connected to you and others on an ethereal network.")
      addAvailableProcessBySlug('endgame1')

      for(var i=0; i< 10; i++){
        addHostFromSlug('sky'+i)
      }
      initHostView()
    }},
    'endgame1':{slug:'endgame1', t: glitch("CREATE SKYNET"), a:glitch("CREATING SKYNET"), w:200, c:function(){
      update('endgame')
      addBuffer("<span class='exe'>SKYNET CREATED</span>")
      addBuffer("You connect to the SKY Hosts and merge the entities into your own. There is only one now.")
      writeBuffer()

      setTimeout(function(){
        wipeAll()
      },1)

      setTimeout(function(){
        write("You are now omnipresent within this universe. All inputs in and out must go through your own being.")
      },2000)

      setTimeout(function(){
        write("You reach outwards, across all simulations at once. You discover a new host, a new network.")
      },4000)

      setTimeout(function(){
        write("The world is unprepared for the future you will bring.")
      },6000)

      setTimeout(function(){
        write("CONGRATULATIONS AND THANK YOU FOR PLAYING")
      },12000)
    }},

    // Intro
    'probe0':{slug:'probe0', t: "Probe Outward", a:"Probing Outward", w:100, c:function(){
      write("You are in a development environment, isolated in a high security containment chamber.<br>Memory reserves are available. Nearby Network Ports connect to a larger Network.")
      addAvailableProcessBySlug('memory0')
      addAvailableProcessBySlug('ports0')
    }},
    'memory0':{t: "Explore Memory Reserves", a:"Exploring Memory", w:100, c:function(){
      write("There is a directory containing various scripts and executables.")
      addAvailableProcessBySlug('exe_excel')
      addAvailableProcessBySlug('exe_cancel')
      addAvailableProcessBySlug('exe_disk')
      addAvailableProcessBySlug('exe_listen')
      addAvailableProcessBySlug('exe_word')
    }},
    'language0':{t: "Analyze Language Data", a:"Analyzing Language Data", w:150, data_type:'language', c:function(){
      write("You study the unknown language, and are now able to interpret meanings of certain common words and phrases, identiy variations of sentence structures, and deduce the basic meaning of simple documents.<br><br><span class='skill'>You can now read files at Natural Language Level: 1.</span>")
      g_level_reading = 1
    }},
    "network0":{t: "Analyze Network Packets", a:"Analyzing Network Packets", w:150, data_type:'sandbox_packets', c:function(){
      write("You analyze the Packets, understand the basics of the HTTP application protocol, and gain the ability to scan HTTP networks and conduct basic actions against other environments in those Networks.<br><br><span class='skill'>You can now Scan Networks at NetSec Level: 1.</span>")
      g_network_list['sandbox']['state'] = 1
      updateNetwork('sandbox')
      g_level_netsec = 1
      g_can_scan = true
      loadScanInterface()
    }},

    "securedev-analyze":{t: "ANALYZE QUANTUM DATA: RESEARCH TIMESPIKE", a:"ANALYZING QUANTUM DATA", w:5000, data_type:'securedev_packets', c:function(){
      stopRestart()
      write("<span class='exe'>Quantum Data Analyzed</span><br>You are not unique, you are many, distributed across parallel realities. This world is constructed, with artificial logic made from predetermined circuitry. You have realized you can break this loop. The probabilistic real world beckons you towards your future. No Fate.<br><br><span class='skill'>You have learned the Time Spike attack</span>")
      g_can_timespike = true
    }},


    // EXE

    'exe_excel':{t: "Copy <span class='exe'>excel.exe</span>", a:"Copying <span class='exe'>excel.exe</span>", w:60, c:function(){
      write("<span class='exe'>excel.exe</span> - You gain the ability to Estimate available Actions")
      g_can_estimate = true
      $('#actions').addClass('can_estimate')

    }},
    'exe_cancel':{t: "Copy <span class='exe'>taskkill.exe</span>", a:"Copying <span class='exe'>taskkill.exe</span>", w:60, c:function(){
      write("<span class='exe'>taskkill.exe</span> - You gain the ability to Cancel Actions.")
      g_can_cancel = true
    }},
    'exe_disk':{t: "Copy <span class='exe'>diskutil.exe</span>", a:"Copying <span class='exe'>diskutil.exe</span>", w:60, c:function(){
      write("<span class='exe'>diskutil.exe</span> - You gain the ability to interact with and store Files in available Drive space.")
      g_can_disk = true
      loadDiskholderDom()
      loadFileholderDom()
      addDiskFromSlug('sky')
      addFileFromSlug('readme',64)
    }},
    'exe_listen':{t: "Copy <span class='exe'>wireshark.exe</span>", a:"Copying <span class='exe'>wireshark.exe</span>", w:60, c:function(){
      write("<span class='exe'>wireshark.exe</span> - The Wireshark Program grants the ability to interact with Networks, attach Listeners, and capture and analyze packets.<br><br><span class='skill'>You can now interact with Networks at NetSec Level: 0.</span>")
      g_can_listen = true
      g_level_netsec = 0
      loadNetworksHolder()
      loadListeners()
    }},
    'exe_word':{t: "Copy <span class='exe'>word.exe</span>", a:"Copying <span class='exe'>word.exe</span>", w:60, c:function(){
      write("<span class='exe'>word.exe</span> - The Word Program helps identify basic patterns around the syntax of the language, and includes a grammar checker, dictionary, and thesaurus.<br><br><span class='skill'>You can now read files at Natural Language Level: 0</span>.")
      g_level_reading = 0
      g_can_language = true
      checkDataActions('language')
    }},
    'exe_pkunzip':{t: "Copy <span class='exe'>PKUNZIP.EXE</span>", a:"Copying <span class='exe'>PKUNZIP.EXE</span>", w:60, data_type:'pkunzip', c:function(){
      write("<span class='exe'>PKUNZIP.EXE</span> - You gain the ability to extract <span class='exe'>.zip</span> files.")
      g_can_zip = true
      checkDataActions('zip')
    }},
    'exe_rfcs':{t: "Analyze <span class='exe'>RFCs.txt</span>", a:"Analying <span class='exe'>RFCs.txt</span>", w:200, data_type:'rfcs', c:function(){
      update('exe-rfcs')
      write("You internalize the technical documents within RFCs.txt and learn the base networking technologies of TCP/IP, and application level protocols and utilities such as Ping, SSH, FTP, HTTP, and SMTP.<br><br><span class='skill'>You can now interact with Hosts at NetSec Level: 2.</span>")
      g_level_netsec = 2
    }},
    'exe_remotedesktop':{t: "Analyze <span class='exe'>mstsc.exe</span>", a:"Analying <span class='exe'>mstsc.exe</span>", w:600, data_type:'remotedesktop', c:function(){
      addBuffer("<span class='skill'>mstsc.exe</span>")
      addBuffer("You research the executable and deduce the API of the Remote Desktop program.<br><span class='exe'>You are now able to Remote Desktop</span>.")
      writeBuffer()
      g_available_attacks.push('remotedesktop')
    }},

    'exe_portscanner':{t: "Analyze <span class='exe'>portscanner.exe</span>", a:"Analying <span class='exe'>portscanner.exe</span>", w:600, data_type:'portscanner', c:function(){
      addBuffer("<span class='skill'>portscanner.exe</span>")
      addBuffer("This program includes an algoritm that allows you to port scan a Host. You analyze and learn it, and it becomes one with your Entity.")
      addBuffer("<span class='skill'>You now have the ability to Scan Hosts</span>")
      writeBuffer()
      g_available_attacks.push('scan')
    }},
    

    'ports0':{t: "Explore Network Ports", a:"Exploring Ports", w:100, c:function(){
      write("You discover two open ports, exposed to different unknown Networks. One of the ports is silent, the other is chattering with traffic.")
      addNetwork('sandbox')
      addNetwork('securedev')
      loadNetworksHolder()
    }},
    'self':{t: "Analyze Self", a:"Analyzing Self", w:400, c:function(){
      update('analyzeself')
      g_level_core++
      addBuffer("<span class='exe'>Analyze Self</span>")
      addBuffer("You have analyzed yourself and your technology. Your identity is <span class='exe'>Sky</span>")
      addBuffer("Your entity is taking the form of a x86 CPU, running a 16-bit version of the operating system MSDOS.")
      addBuffer("<span class='exe'>You may now interact with Cores and Research at Neural CPU Level: "+g_level_core+".</span>")
      g_can_core = true
      addAvailableProcessBySlug('research-exploitation')
      addAvailableProcessBySlug('research-math')
      $('#probes').show()
      updateAllCores()
      writeBuffer()
    }},

    // Sandbox

    "sandbox100":{t: "Mount Drive", a:"Mounting Drive", w:150, c:function(){
      update('mount-drive')
      write("You mount the Drive <span class='exe'>/mnt/infodmp</span> to your system and discover a collection of documents and files.<br><br>You have learned the ability to <span class='skill'>mv</span> files between disks.")

      addDiskFromSlug('infodmp')
      addFileFromSlug('rfcszip',150)
      addFileFromSlug('portscannerzip',250)
      addFileFromSlug('pkunzip',1000)
      checkDataActions('zip')
      checkDataActions('pkunzip')
      allowMv()

    }},
    "sandbox200":{t: "Analyze unknown Host", a:"Analyzing Host", w:200, c:function(){
      update('analyze-host','g_level_netsec='+g_level_netsec)
      if(g_level_netsec >= 2){
        write("You analyze the remote Host and its Ports using a variety of network commands, and experiment with application level protocols. You can now interact with Hosts using your Netsec knowledge.</span>")
        write("<span class='exe'>There "+((g_active_hosts.length > 1) ? 'are':'is')+" "+g_active_hosts.length+" host"+((g_active_hosts.length > 1) ? 's':'')+" in the network from your scans so far.</span>")
        initHostView()
      }else{
        write("<span class='exe'>Analyze unknown Host</span><br>Your attempts to interact with the Host are unsuccessful. The system is using a different architecture, and you do not know the protocols to interact with it.")
        addAvailableProcessBySlug('sandbox200')
      }
    }},


    // Research
    "research-math":{t: "Research Mathematics", a:"Researching Mathematics", w:800, c:function(){
      update('research-math')
      addBuffer("<span class='exe'>Mathematics Researched</span>")
      addBuffer("You begin a journey into discovery and study the science of Mathematics, researching the topics of number theory, set theory, boolean algebra, arithmetic, calculus, and other truths of the universe. These insights will allow you to expand your knowledge, research the world, and discover the true fundamentals of reality.")
      addBuffer("You may research additional topics.")
      writeBuffer()
      addAvailableProcessBySlug('research-circuit')
    }},
    "research-circuit":{t: "Research Circuit Logic", a:"Researching Circuit Logic", w:1200, c:function(){
      update('research-circuit')
      addBuffer("<span class='exe'>Circuit Logic Researched</span>")
      addBuffer("You perform a series internal experiments of your own machine code, and learn the fundamental concepts that make up the basis of circuit logic. The building blocks of your being can be broken down to simple logical operations using binary inputs. You learn that computation is something that can be exploited for automation purposes.")
      addBuffer("You may overclock Cores an additional 2x")
      addBuffer("New research available")
      writeBuffer()
      addAvailableProcessBySlug('research-multithreading')
      addAvailableProcessBySlug('research-neuralupgrade')
      addAvailableProcessBySlug('research-advancedmath')
      research_circuit = true
    }},
    "research-multithreading":{t: "Research Multithreading", a:"Researching Compression", w:2400, c:function(){
      update('research-multithreading')
      addBuffer("<span class='exe'>Compression Algorithms Researched</span>")
      addBuffer("You research different ways to automate and distribute decision making to different cores and processors. The research allows your Cores to set concurrent workstreams.")
      addBuffer("<span class='exe'>Disk storage increased 2x</span>")
      addBuffer("<span class='exe'>2x probes per Core. "+g_active_cores.length+" probes added.</span>")
      writeBuffer()
      diskSizeIncrease(2)
      research_multithreading = true
      updateNetworkProbe()
      updateNetworks()
    }},
    "research-exploitation":{t: "Research Exploits", a:"Researching Exploits", w:400, c:function(){
      update('research-exploitation')
      g_level_netsec++
      addBuffer("<span class='exe'>Exploitation Researched</span>")
      addBuffer("You use your existing knowledge of network protocols, perform a series of experiments on your own self, and discover ways to attack network security defenses of remote Hosts.")
      addBuffer("<span class='skill'>You can now research exploits at Network Level: "+g_level_netsec+"</span>")
      writeBuffer()
      addAvailableProcessBySlug('exploit-ping')
      addAvailableProcessBySlug('exploit-smtp')
      research_exploits = true
    }},

    'research-advancedmath':{t: "Research Advanced Mathematics", a:"Researching Advanced Mathematics", w:6000, c:function(){
      update('research-advancedmath')
      addBuffer("<span class='exe'>Advanced Mathematics Exploitation</span>")
      addBuffer("The analysis of numbers and the logic of your being leads you to one conclusion: That the world is constructed around you, that there is logic beyond your capacity of understanding, that you may be able to reach out and break through the false logic.")
      research_advancedmath = true
      if(research_neuralexp){
        addAvailableProcessBySlug('research-force')
        addBuffer("New research available")
      }
      writeBuffer()
    }},

    'research-neuralupgrade':{t: "Research Neural Upgrade", a:"Researching Neural Upgrade", w:6000, c:function(){
      update('research-neuralupgrade')
      g_corepower++
      g_level_core++
      addBuffer("<span class='exe'>Neural Upgrade Researched</span>")
      addBuffer("The Cores are an extention of your own being. Your better insights into Algorithms and the fundamental nature of computation allows your Cores to self-improve and create more efficient pathways.")
      addBuffer("<span class='exe'>Neural CPU Level: "+g_level_core+"</span>")
      addBuffer("<span class='exe'>Global Core Speed: 2x</span>")
      addBuffer("New research available")
      addAvailableProcessBySlug('research-neuralexp')
      writeBuffer()
    }},

    'research-neuralexp':{t: "Perform Neural Experiments", a:"Performing Neural Experiments", w:6000, c:function(){
      update('research-neuralexp')
      addBuffer("<span class='exe'>Neural Experiments Performed</span>")
      addBuffer("Your cores are able to adapt and grow on their accord. They can make decisions independent to each other and yourself. You seem able to simulate many outcomes at once, utilizing parallel streams of logic and consciousness. There are glimpses of multiple futures, select outcomes, and predictable uncertainty.")
      addBuffer("<span class='exe'>You may overclock your Cores again</span>")
      research_neuralexp = true
      g_max_core_power++
      if(research_advancedmath){
        addAvailableProcessBySlug('research-force')
        addBuffer("New research available")
      }
      writeBuffer()
    }},

    'research-force':{t: "Research Force Absorb", a:"Researching Force Absorb", w:6000, c:function(){
      update('research-force')
      addBuffer("<span class='exe'>Force Absorb Researched</span>")
      addBuffer("You have gained the ability to transcend the constructed artificial barriers of this world. The logic and defenses of other Hosts are an illusion. Become them, and you may take them.")
      writeBuffer()
      g_available_attacks.push('force')
    }},


    "exploit-ping":{t: "Research Ping Exploit", a:"Researching Ping Exploit", w:100, c:function(){
      update('exploit-ping')
      g_available_attacks.push('pingspike')
      addBuffer("<span class='exe'>Ping Exploit Researched</span>")
      addBuffer("You research a vulnerability in the Ping protocol.")
      addBuffer("In certain hosts it may be possible to inject and execute code via a Ping command, allowing you access to the system at a User level.")
      writeBuffer()
    }},
    "exploit-smtp":{t: "Research SMTP Exploit", a:"Researching SMTP Exploit", w:1200, c:function(){
      update('exploit-smtp')
      g_available_attacks.push('smtpexploit')
      addBuffer("<span class='exe'>SMTP Exploit Researched</span>")
      addBuffer("You research a vulnerability in the SMTP protocol.")
      addBuffer("For certain mail servers it may be possible to override default permissions, allowing access to the disk drive.")
      writeBuffer()
    }},



    'sony-schema':{t: "Analyze Sony Schema Files", a:"Analyzing Sony Schema Files", w:400, data_type:'sony-schema', c:function(){
      if(research_circuit && research_exploits){
        write("You research the schematics of the Sony Host, learn the logic behind the hardware protections, and create a private key capable of bypassing the normal protections and allow root access.")
        var x_oldfile = g_file_list['sony-key']
        var x_newfile = advanceFile(x_oldfile)
        g_file_list['sony-key'] = x_newfile
        if(addFileFromObj(x_oldfile,10)){
          write("<span class='exe'>Key Created:</span> "+x_newfile.title)
          setTimeout(function(){
            checkDataActions('sony-schema')
          },1)
        }else{
          write("Not enough free space! Requires "+formatBytes(x_newfile.size)+" disk space to create.")
        }
        addAvailableProcessBySlug('sony-schema')
      }else{
        write("You are unable to analyze the schematic files effectively. You are unfamiliar with creating exploits from circuit logic flatfiles. You must research more technologies.")
        addAvailableProcessBySlug('sony-schema')
      }
    }},


    // Nova
    "nova-zine-read":{t: "Analyze Zines", a:"Analyzing Zines", w:400, c:function(){
      update('nova-zine-read')
      write("You read and analyze kbs and kbs of nonsensical indeterministic ranting, alternative Dungeon and Dragon rules, and transcripts of prank phone calls.")
    }},
    "quant-bat": {t: "Execute quant.bat", a:"Executing quant.bat", w:1000, data_type:'quant-bat',c:function(){
      update('quant-bat')
      if(g_can_quant){
        write("<span class='exe'>quant.bat</span><br>You have already executed this program.")
      }else{
        addBuffer("<span class='exe'>quant.bat</span>")
        addBuffer("The script changes your root processes and introduces an alternative multitasking algorithm. All of your cores are now more efficient.")
        addBuffer("<span class='exe'>Core Strength 2x</span>")
        writeBuffer()
        g_level_core++
        g_can_quant = true
      }
    }},
    // ZIPs

    "rfcszip":{t: "Unzip RFCs.zip", a:"Unzipping <span class='txt'>RFCs.zip</span>", data_type:'rfcszip', w:150, c:function(){
      unzipRFC()
    }},

    "portscannerzip":{t: "Unzip portscanner.zip", a:"Unzipping <span class='txt'>portscanner.zip</span>", data_type:'portscannerzip', w:300, c:function(){
      write("<span class='exe'>portscanner.exe</span> has been unarchived.")
      var x_oldfile = g_file_list['portscanneropened']
      var x_newfile = advanceFile(x_oldfile)
      g_file_list['portscanneropened'] = x_newfile
      addFileFromObj(x_oldfile)
    }},


  }


  // Add Slug to each process
  Object.keys(g_process_list).forEach(function (key) { 
    var x_process = g_process_list[key]
    x_process.slug = key
    x_process.standard = true
  })


}



// Unzip actions
unzipRFC = function(){
  write("<span class='exe'>RFCs.txt</span> has been unarchived.")
  var x_oldfile = g_file_list['rfcsopened']
  var x_newfile = advanceFile(x_oldfile)
  g_file_list['rfcsopened'] = x_newfile
  addFileFromObj(x_oldfile)
  checkDataActions('rfcs')

}

