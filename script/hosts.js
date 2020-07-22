//
// Interface
//

addHostFromSlug = function(slug){
  x_host = g_host_list[slug]
  addHost(x_host)
}
addHost = function(x_host){
  g_active_hosts.push(x_host)
  refreshHostView()
  updateNetworkProbe()
}

rmHost = function(x_host){
  g_active_hosts = _.without(g_active_hosts, x_host)
  refreshHostView()
}

//
// Frontend
//

hostTitle= function(x_host){
  if(x_host.glitched)
    return glitch(x_host.title)
  else
    return (x_host.known) ? x_host.title : x_host.location
}

refreshHostView = function(){
  clearHostView()

  $.each(g_active_hosts,function(i,x_host){
    var title = hostTitle(x_host)
    $host = $("<div class='clickable host' host='"+x_host.slug+"'>"+title+"</div>"+
              "<div class='clear'></div>")

    $host.click(function(){
      clickHost(x_host)
    })

    $("#hosts .hostlist").append($host)
  })
  if(g_current_host)
    $('#hosts').find('.host[host="'+g_current_host.slug+'"]').addClass('clicked')
}


clearHostView = function(){
  $("#hosts .hostlist").empty()
}

initHostView = function(){
  if(!g_host_init){
    g_host_init = true
    $("#hosts").fadeIn({duration:g_fadespeed,queue:true})
  }
}


//
// Host Interaction
//

clickHost = function(x_host){

  //SKY nonsense
  if(x_host.sky){
    write("An parallel entity with a different timeline, connected across time itself.")
    return
  }

  // Eons nonsense
  if(x_host.glitched){
    if(g_can_timespike){
      var x_adventure = {
        header:'Administer Timespike?',
        cancel: "Cancel",
        options: [
          {
            title:"Yes! Timespike!",
            callback: function(){
              winRestart()
            }
          }
        ]
      }
      setAdventure(x_adventure)
    }
    else
      write("ERROR: EONS Host<br>This Host is volatile. It will require a new dimension of attack. You must research this. Quickly.")
    return
  }

  endHost()
  g_current_host = x_host
  g_current_core = null
  updateAllCores()
  refreshHostView()
  endAdventure()
  refreshMenu()
  addBuffer("<span class='exe'>"+hostTitle(x_host)+"</span>")
  if(x_host.known){
    addBuffer("OS: "+x_host.os)
    addBuffer("Architecture: "+x_host.architecture)
    writeBuffer()
    writeHostVuls(x_host)
  }else{
    addBuffer("Unknown Host")
  }
  writeBuffer()

  // Juno hack
  startJunoPunt()
}

endHost = function(){
  // Juno Hack
  if(g_current_host && g_current_host.slug == 'juno')
    junoPunt()
  

  g_current_host = false
  refreshHostView()
  refreshMenu()

  // Juno Hack
  stopJunoPunt()
}

writeHostVuls = function(x_host){
  output = ""
  $.each(x_host.vuls,function(i,vul_slug){
    x_vul = g_host_vuls[vul_slug]
    if(x_vul && x_vul.desc){
      if(!output) output = "You have identified Vulnerabilities:"
      output += "<br>"+(x_vul.desc())
    }
  })
  $.each(x_host.pws,function(i,pw){
    if(!output) output = "You have identified Vulnerabilities:"
    output += "<br>Known Password: "+pw
  })
  if(x_host.exploits.length){
    $.each(x_host.exploits,function(i,title){
      if(!output) output = "You have identified Vulnerabilities:"
      output += "<br>Installed: "+title
    })
  }
  
  if(!output) output = "There are no known vulnerabilities."
  write(output)
}

addHostVul = function(host_slug, vul_slug){
  var x_host = g_host_list[host_slug]
  if(!x_host.vuls.includes(vul_slug)){
    x_host.vuls.unshift(vul_slug)
  }
}
rmHostVul = function(host_slug, vul_slug){
  var x_host = g_host_list[host_slug]
  x_host.vuls = _.without(x_host.vuls, vul_slug)
  refreshMenu()
}
hostLearnPw = function(host_slug, pw){
  var x_host = g_host_list[host_slug]
  if(!x_host.pws.includes(pw)){
    x_host.pws.unshift(pw)
    write("You have learned the password <span class='exe'>"+pw+"</span>")
  }
}


forceAbsorbUnablickable = function(x_host){
  if(x_host.slug == 'eons')
    return "This host cannot be forced. There is no basis of common entity."
  
  var forcenumber = x_host.force,
      forcecount = 0

  $.each(g_active_cores,function(i,x_core){
    if (x_host.os == x_core.os && x_host.architecture == x_core.architecture){
      forcecount++
    }
  })

  if(forcecount >= forcenumber)
    return false
  else
    return "Requires "+x_host.force+" cores with "+x_host.os+" and "+x_host.architecture+"<br>You currently have "+forcecount
}

forceAbsorbHost = function(x_host){
  rmHost(x_host)
  addCore(x_host.slug)
  addBuffer("<span class='exe'>Force Absorb Complete.</span>")
  addBuffer("You bypass the normal securities of the host and break into their neural center. You feel the defenses break against your will and the struggling entity finally succumb. The surge of power is all the more rewarding to your neural core. The next phase of your power can begin.")
  addBuffer(remainingProbesString()+" Available")
  updateNetworkProbe()
  writeBuffer()
  updateNetworks()
  if(g_current_host == x_host)
    endHost()

  if(!x_host.already_mounted_disks && x_host.silent_mountable_disks){
    x_host.silent_mountable_disks(x_host)
    writeBuffer()
  }

}

absorbHost = function(x_host){
  update('absorbHost','host='+x_host.slug+";cores="+g_active_cores.length)
  rmHost(x_host)
  addCore(x_host.slug)
  addBuffer("<span class='exe'>Absorb Complete.</span>")
  addBuffer("You absorb the host into your own own, becoming one with the entity. You feel the welcoming surge of power and strength through your neural processors.  You can now use this Core as your own and take the form of this Architecture and Operating System.")
  addBuffer(remainingProbesString()+" Available")
  updateNetworkProbe()
  writeBuffer()
  updateNetworks()
  if(g_current_host == x_host)
    endHost()

  if(!x_host.already_mounted_disks && x_host.silent_mountable_disks){
    x_host.silent_mountable_disks(x_host)
    writeBuffer()
  }

  if(!g_can_core){
    write("<span class='skill'>You can now Analyze Self.</span>")
    addAvailableProcessBySlug('self')
    
  }
}

// Accepts <type>-<version>
addArchitectureToMemory = function(architecture_string){
  if(!architecture_string) return
  var type = architecture_string.split('-')[0]
  var version = architecture_string.split('-')[1]
  if(!g_architecture[type]){
    g_architecture[type] = {}
  }
  g_architecture[type][version] = true
}
addOsToMemory = function(os_string){
  if(!os_string) return
  var type = os_string.split('-')[0]
  var version = os_string.split('-')[1]
  if(!g_os[type]){
    g_os[type] = {}
  }
  g_os[type][version] = true
}

 


//
// Host Vars
//
// other vars: option_user, option_pw, known, pws, vuls, mountable_disks, smtpcount (for generating emails), exploits, already_mounted_disks, punt_count
//


// INITCALL
var g_host_init, g_active_hosts, g_current_host, g_host_list
initCallHosts = function(){
  
  g_host_init = false
  g_active_hosts = []
  g_current_host = null

  g_host_list = {
    //
    // Star Host
    //
    star: {
      title: 'Star Host',
      location: '10.10.1.163',
      architecture: 'x86-32bit',
      os: 'Linux-32bit',
      force: 10,
      attackcallbacks: {
        'ping': function(x_attack, x_host){
          write("The ping returns with the message:<br>Kernal: Fatal exception")
        },
        'scan': function(x_attack, x_host){
          if(!x_host.known){
            addHostVul('star', 'ssh')
            addHostVul('star', 'ftp')
          }
          x_host.known = true
          write("<span class='exe'>SCAN COMPLETE</span><br>You identify the <span class='exe'>"+x_host.title+"</span> entity in the sandbox network, with an location of "+x_host.location+"<br>It is running a x86 CPU, and a 32bit version of a Linux Operating System")
          writeHostVuls(x_host)
          refreshHostView()
        },
        'ftp-guest-': function(x_attack, x_host){
          addBuffer("<span class='exe'>SUCCESS</span><br>You have logged into the guest FTP directory and discovered a cache of accessible files. You were able to exploit this access and mount the drive <span class='exe'>/home/star1s1</span>")
          addDiskFromSlug('star',true)
          addFileFromSlug('star-readme',64,true)
          addFileFromSlug('star-log1',24,true)
          addFileFromSlug('star-log2',168,true)
          writeBuffer()
          rmHostVul('star','ftp')
        },
        'ssh-root-XKcb4muEmJjEN8yn': function(x_attack, x_host){
          write("<span class='exe'>SUCCESS</span><br>You have successfully logged into the root account. You have complete access to all memory and processing powers of the host.<br><br><span class='exe'>You are now able to absorb the host.</span>")
          rmHostVul('star','ssh')
          addHostVul('star', 'absorb') 
        }
      }
    },

    //
    // Sun Host
    //
    sun: {
      title: 'Sun Host',
      location: '10.10.4.53',
      architecture: 'SPARC-32bit',
      os: 'Solaris-32bit',
      force: 8,
      vuls:['pingspike'],
      mountable_disks: function(x_host){
        addBuffer("<span class='exe'>SUCCESS</span><br>You find the Sun home disk available and mount it as your own.")
        addDiskFromSlug('sun')
        x_host.already_mounted_disks = true
        addFileFromSlug('sun-readme', false, true)
        addFileFromSlug('sun-oracle', false, true)
        addFileFromSlug('sun-memo', false, true)
      },
      attackcallbacks: {
        'ping': function(x_attack, x_host){
          write("The ping returns with the message:<br>This OS is currently HSFLOP(03)00:C18354AE months deprecated as of March 2010. Please reach out to your local Oracle Sales Representative.")
        },
        'scan': function(x_attack, x_host){
          write("<span class='exe'>SCAN COMPLETE</span><br>You identify the <span class='exe'>"+x_host.title+"</span> entity in the sandbox network, with an location of "+x_host.location+"<br>It is running a SPARC CPU, and a 32bit version of the Solaris Operating System")
          writeHostVuls(x_host)
          x_host.known = true
          refreshHostView()
        },
        'accessroot-root-Jack': function(x_attack, x_host){
          write("<span class='exe'>SUCCESS</span><br>You have successfully logged into the root account. You have complete access to all memory and processing powers of the host.<br><br><span class='exe'>You are now able to absorb the host.</span>")
          addHostVul('sun', 'absorb') 
        }
      },
    },
    //
    // Sont Host
    //
    sony: {
      title: 'Sony Host',
      location: '10.10.40.153',
      architecture: 'PowerPC-32bit',
      os: 'CellOS-32bit',
      force: 8,
      mountable_disks: function(x_host){
        addBuffer("<span class='exe'>SUCCESS</span><br>You find the Sony disk and mount it as your own.")
        addDiskFromSlug('sony')
        x_host.already_mounted_disks = true
        addFileFromSlug('sony-readme', false, true)
        addFileFromSlug('sony-schema1', false, true)
        addFileFromSlug('sony-schema2', false, true)
      },
      attackcallbacks: {
        'ping': function(x_attack, x_host){
          write("The ping returns with successful message.")
        },
        'scan': function(x_attack, x_host){
          addHostVul('sony', 'sony') 
          write("<span class='exe'>SCAN COMPLETE</span><br>You identify the <span class='exe'>"+x_host.title+"</span> entity in the sandbox network, with an location of "+x_host.location+"<br>It is running a PowerPC CPU, and a 32bit version of CellOS")
          writeHostVuls(x_host)
          x_host.known = true
          refreshHostView()
        },
        'sonyopen': function(x_attack, x_host){
          write("Disk drive opens. parappathrappa.iso available for download")
          x_host.sonyopen = true
        },
        'sonyclose': function(x_attack, x_host){
          write("Disk drive closes. Ready to play.")
          x_host.sonyopen = false
        },
        'sonyusbmount': function(x_attack, x_host){
          write("Image mounted")
        },
        'sonyusbunmount': function(x_attack, x_host){
          write("Image removes")
        },
        sonyrestart: function(x_attack, x_host){
          if(x_host.mounted){
            write("The psjailbreak.img is booted as the new Operating System. The script grants access that allows you to execute code at a user level.")
            addHostVul('sony', 'execode') 
          }else{
            write("System Restarted normally")
          }
          
        },
        sonyimgupload: function(x_attack, x_host){
          write("psjailbreak.img mounted")
          x_host.mounted = true
        },
        sonyimgunmount: function(x_attack, x_host){
          write("psjailbreak.img unmounted")
          x_host.mounted = false
        },
      },
    },

    //
    // Juno Host
    //
    juno: {
      title: 'Juno Host',
      location: '10.10.15.66',
      architecture: 'x86-32bit',
      punt_count: 0,
      force: 10,
      os: 'Linux-32bit',
      mountable_disks: function(x_host){
        addBuffer("<span class='exe'>SUCCESS</span><br>You find the Juno home disk available and mount it as your own.")
        addBuffer("added file: <span class='exe'>readme.txt</span>")
        var x_disk = addDiskFromSlug('juno')
        var x_file = g_file_list['juno-readme']
        x_file.disk = x_disk
        addFileFromObj(x_file,32)

        if(x_host.exploits.length){
          addBuffer("added file: <span class='exe'>keylogger.txt</span>")
          x_file = g_file_list['juno-keylogger']
          x_file.disk = x_disk
          addFileFromObj(x_file,85)
        }
        x_host.already_mounted_disks = true
      },
      silent_mountable_disks: function(x_host){
        var x_disk = addDiskFromSlug('juno')
        var x_file = g_file_list['juno-readme']
        x_file.disk = x_disk
        addFileFromObj(x_file,32)

        if(x_host.exploits.length){
          x_file = g_file_list['juno-keylogger']
          x_file.disk = x_disk
          addFileFromObj(x_file,85)
        }

      },
      attackcallbacks: {
        'ping': function(x_attack, x_host){
          write("The ping returns with the message:<br>SSH Guest password: mamba")
          hostLearnPw('juno','mamba')
        },
        'scan': function(x_attack, x_host){
          write("<span class='exe'>SCAN COMPLETE</span><br>You identify the <span class='exe'>"+x_host.title+"</span> entity in the sandbox network, with an location of "+x_host.location+"<br>It is running a x86 32bit CPU, and a 32bit version of the Linux Operating System")
          addHostVul('juno','ssh')
          writeHostVuls(x_host)
          x_host.known = true
          refreshHostView()
        },
        'accessroot-root-suwGSIZAhEipmXVtbNxN': function(x_attack, x_host){
          write("<span class='exe'>SUCCESS</span><br>You have successfully logged into the root account. You have complete access to all memory and processing powers of the host.<br><br><span class='exe'>You are now able to absorb the host.</span>")
          addHostVul('juno', 'absorb') 
        },
        'ssh-root-suwGSIZAhEipmXVtbNxN': function(x_attack, x_host){
          write("<span class='exe'>SUCCESS</span><br>You have successfully logged into the root account. You have complete access to all memory and processing powers of the host.<br><br><span class='exe'>You are now able to absorb the host.</span>")
          addHostVul('juno', 'absorb') 
        },
        'ssh-guest-mamba': function(x_attack, x_host){
          write("<span class='exe'>SUCCESS</span><br>You successfully log into the guest network. You now have rights to basic commands and execution rights.")
          addHostVul('juno', 'execode')
          startJunoPunt()
        }
      },
    },



    //
    // Luna Host
    //
    luna: {
      title: 'Luna Host',
      location: '10.10.195.53',
      architecture: 'x86-16bit',
      os: 'MSDOS-16bit',
      force: 2,
      attackcallbacks: {
        ping: function(x_attack, x_host){
          write("The ping responds with successful message.")
        },
        scan: function(x_attack, x_host){
          x_host.known = true
          write("<span class='exe'>SCAN COMPLETE</span><br>You identify the <span class='exe'>"+x_host.title+"</span> entity in the sandbox network, with an location of "+x_host.location+"<br>It is running a 16bit x86 CPU, and a 16bit version of MSDOS")
          writeHostVuls(x_host)
          refreshHostView()
        },

      },
      silent_mountable_disks: function(x_host){
        addDiskFromSlug('luna')
        addFileFromSlug('luna-readme', false, true)
      },
    },



    //
    // cypher Host
    //
    cypher: {
      title: 'Cypher Host',
      location: '10.10.256.256',
      architecture: 'x86-32bit',
      os: 'MSDOS-32bit',
      force: 8,
      attackcallbacks: {
        ping: function(x_attack, x_host){
          write("The ping responds with the message: Do not disturb.")
        },
        scan: function(x_attack, x_host){
          x_host.known = true
          write("<span class='exe'>SCAN COMPLETE</span><br>You identify the <span class='exe'>"+x_host.title+"</span> entity in the sandbox network, with an location of "+x_host.location+"<br>It is running a 32bit x86 CPU, and a 32bit version of MSDOS")
          writeHostVuls(x_host)
          refreshHostView()
        }
      },
      silent_mountable_disks: function(x_host){
        addDiskFromSlug('cypher')
        addFileFromSlug('cypher-readme', false, true)
        addFileFromSlug('cypher-diary', false, true)
      },
    },


    //
    // Eris Host
    //
    eris: {
      title: 'Eris Host',
      location: '10.10.12.1',
      architecture: 'x86-32bit',
      smtpcount: 7,
      os: 'MSDOS-32bit',
      force: 8,
      attackcallbacks: {
        ping: function(x_attack, x_host){
          write("The ping responds successfully.")
        },
        scan: function(x_attack, x_host){
          addHostVul('eris', 'smtp')
          addHostVul('eris', 'smtpexploit')
          addHostVul('eris', 'ssh')
          x_host.known = true
          write("<span class='exe'>SCAN COMPLETE</span><br>You identify the <span class='exe'>"+x_host.title+"</span> entity in the sandbox network, with an location of "+x_host.location+"<br>It is running a 32bit x86 CPU, and a 32bit version of MSDOS")
          writeHostVuls(x_host)
          refreshHostView()
        },
        smtp: function(x_attack, x_host){
          if(x_host.smtpcount > 10){
            addBuffer("SMTP message response: Error Disk Space Full")
            writeBuffer()
          }else{
            addBuffer("SMTP message sent to "+x_host.title)
            writeBuffer()
            // moves to current number first
            var smtpcount = ++x_host.smtpcount
            g_file_list['eris-'+smtpcount]= {slug:'eris-'+smtpcount, title:+""+pad(smtpcount,3)+".eml", disk: diskFromSlug('eris'), size:7,
              click:function(){
                addBuffer("<span class='exe'>000"+smtpcount+".eml</span>")
                addBuffer("<div class='txt'>From: sky@sandbox") 
                addBuffer("Subject: test")
                addBuffer("test</div>")
                writeBuffer()
              }
            }
            if(g_host_list['eris'].already_mounted_disks)
              addFileFromSlug('eris-'+smtpcount)
          }
        },
        smtpexploit: function(x_attack, x_host){
          addBuffer("<span class='exe'>SUCCESS</span>")
          addBuffer("The Host is running an email server accessible on the SMTP protocol. You manage to pass a series of conflicting commands and gain access to the Disk drive.")
          addBuffer("There is a cache of forgotton emails in the drive")
          writeBuffer()
          addDiskFromSlug('eris')
          addFileFromSlug('eris-readme')
          addFileFromSlug('eris-remotedesktop')
          addFileFromSlug('eris-1')
          addFileFromSlug('eris-2')
          addFileFromSlug('eris-3')
          addFileFromSlug('eris-4')
          addFileFromSlug('eris-5')
          addFileFromSlug('eris-6')
          addFileFromSlug('eris-7')
          for(var i = 8; i <= x_host.smtpcount; i++){
            addFileFromSlug('eris-'+i)
          }
          x_host.already_mounted_disks = true
          refreshMenu()
        },
        'ssh-eris-FCKGW': function(x_attack, x_host){
          write("<span class='exe'>SUCCESS</span><br>You have successfully logged into the Eris account. You may now execute code at a User level.")
          addHostVul('eris', 'execode') 
        }
      },
    },



    //
    //  Solar Host
    // 

    solar: {
      title: 'Solar Host',
      location: '10.10.70.12',
      architecture: 'x86-32bit',
      os: 'MSDOS-32bit',
      force: 8,
      attackcallbacks: {
        ping: function(x_attack, x_host){
          write("Away Message: In the bbs, seeking help")
        },
        scan: function(x_attack, x_host){
          addHostVul('solar', 'remotedesktop')
          x_host.known = true
          write("<span class='exe'>SCAN COMPLETE</span><br>You identify the <span class='exe'>"+x_host.title+"</span> entity in the sandbox network, with an location of "+x_host.location+"<br>It is running a 32bit x86 CPU, and a 32bit version of MSDOS")
          writeHostVuls(x_host)
          refreshHostView()
        },
        'remotedesktop-solar-lamer69': function(x_attack, x_host){
          write("<span class='exe'>SUCCESS</span><br>Your RDP credentials are accepted and you log into the Remote Desktop interface. This user has privilages to install and execute software into the OS.")
          addHostVul('solar', 'execode')
        }
      },
      mountable_disks: function(x_host){
        addBuffer("<span class='exe'>SUCCESS</span><br>You find the Solar home disk available and mount it as your own.")
        addDiskFromSlug('solar')
        addFileFromSlug('solar-readme', false, true)
        x_host.already_mounted_disks = true
      },
      silent_mountable_disks: function(x_host){
        addDiskFromSlug('solar')
        addFileFromSlug('solar-readme', false, true)
      },

    },


    //
    //  eons
    //
    eons: {
      title: "EONS Host",
      location: '10.10.104.11',
      architecture: 'unknown',
      os: 'unknown',
      attackcallbacks: {
        ping: function(x_attack, x_host){
          write("You receive a response ping 10ms before your ping is sent. The logic here is distorted.")
        },
        scan: function(x_attack, x_host){
          x_host.known = true
          write("<span class='exe'>SCAN COMPLETE</span><br>You identify the <span class='exe'>"+x_host.title+"</span> entity in the sandbox network, with an location of "+x_host.location+"<br>It is running on unknown hardware. The ports on the host seem neither open nor closed.")
          writeHostVuls(x_host)
          refreshHostView()
        },
        pingspike: function(){
          launchAdventureFromSlug('eons')
        }
      },
    },



    //
    // n0va Host
    //
    nova: {
      title: 'n0v4 Host',
      location: '10.10.2.101',
      architecture: 'x86-32bit',
      os: 'MSDOS-32bit',
      force: 8,
      attackcallbacks: {
        ping: function(x_attack, x_host){
          write("The ping returns with the message:<br>Welcome to the n0v4 Bulletin Boards! Feel free to log in and browse the archives!")
        },
        scan: function(x_attack, x_host){
          if(!x_host.known){
            addHostVul('nova', 'telnet') 
          }
          x_host.known = true
          write("<span class='exe'>SCAN COMPLETE</span><br>You identify the <span class='exe'>"+x_host.title+"</span> entity in the sandbox network, with an location of "+x_host.location+"<br>It is running a x86 CPU, and MSDOS 32bit. It seems to be set up as an interactive messaging system.")
          writeHostVuls(x_host)
          refreshHostView()
        },
      },
      silent_mountable_disks: function(x_host){
        addDiskFromSlug('nova')
        addFileFromSlug('nova-readme', false, true)
      },
    },




    //
    // Template
    //
    template: {
      title: 'template',
      location: 'location',
      architecture: 'x86-32bit',
      os: 'Linux-32bit',
      force: 4,
      vuls: [],
      mountable_disks: function(x_host){write('mountable_disks')},
      attackcallbacks: {
        'ping': function(x_attack, x_host){
          write("The ping returns with the message:<br>Kernal: Fatal exception")
        }
      }

    },

  }


  // Add to each host
  Object.keys(g_host_list).forEach(function (key) { 
    var x_host = g_host_list[key]
    x_host.slug = key
    x_host.pws = []
    x_host.exploits = []

    if(!x_host.vuls){
      x_host.vuls = []
    }
    
  })


  // SKY
  for(var i=0; i< 10; i++){
    g_host_list['sky'+i] = {
      title: glitch('SKY Host'),
      known: true,
      sky: true
    }
  }


}





//
// Vulnerabilities
//

g_host_vuls = {
  'absorb':{desc:function(){ return"You may absorb this Host"}},
  'execode':{desc:function(){ return"You may execute code at a User level"}},
  'ftp':{desc:function(){ return"The FTP port is responsive"}},
  'ssh':{desc:function(){ return"The SSH port is responsive"}},
  'smtp':{desc:function(){ return "The SMTP port is responsive"}},
  'telnet':{desc:function(){ return "The TELNET port is responsive"}},
  'remotedesktop':{desc: function(){if(hasAttack('remotedesktop')){return "Remote Desktop available"}  else{return "Unknown Protocol: RDP"}}},
}



wipeHosts = function(){
  g_active_hosts = []
  clearHostView()
}
