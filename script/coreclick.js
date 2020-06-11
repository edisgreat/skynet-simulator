var g_current_core

temp = {

  //
  // Core Click
  //

  // boilerplate

  core_click: {
    execute: function(){
      var x_core = g_current_core
      updateAllCores()
      endHost()
      write(coreClickString(x_core))
      launchAdventureFromSlug('core_click_callback')
      refreshMenu()
    }
  },

  core_click_callback: {
    execute: function(){
      var x_core = g_current_core,
          options = []

      options.push({
        title:"Change Form",
        callback: function(){
          launchAdventureFromSlug('core_change_form')
        }
      })

      if(!x_core.ailments.length){

        var x_exploit = getAvailableExploitResearch(x_core)
        var unclickable_string
        var estimate_number = 0

        if(!research_exploits){
          unclickable_string = "You have not yet researched the ability to create Exploits."
        }else{
          unclickable_string = "No exploits available for "+x_core.os
          switch(true){
            case (x_exploit == 'discovered'):
              unclickable_string = "You have already researched all exploits for "+x_core.os
              break;
            case (!!x_exploit):
              unclickable_string = false
              estimate_number = 400
              break;
          }
        }


        options.push({
          title:x_core.os+" Exploit",
            estimate: estimateProcessByWeight(estimate_number),
            unclickable: unclickable_string,
            callback: function(){
              var x_process = {slug:'core_research_os_'+x_core.title, a: "Researching Exploit", w: 400,
                c: function(){
                  addBuffer("<span class='exe'>Exploit Researched</span>")
                  addBuffer(x_exploit.to_s())
                  addBuffer(x_exploit.exe)
                  writeBuffer()
                  addExploit(x_exploit)
                }
              }
              setProcessToCore(x_core, x_process)
              endAdventure()
            }
        })

        var upgradeable_os = coreClickableUpgradeOS(x_core)
        options.push({
          title:"Research New OS",
          unclickable: upgradeable_os ? false : "The "+x_core.architecture+" Architecture does not allow an upgrade to the "+x_core.os+" Operating System",
          estimate: upgradeable_os ? estimateProcessByWeight(500) : undefined,
          callback: function(){
            var x_process = {slug:'upgrade_os_'+x_core.title, a: "Researching OS upgrade", w: 500, c: function(){
                x_core.os = upgradeable_os
                addOsToMemory(upgradeable_os)
                addBuffer("<span class='exe'>"+upgradeable_os+"</span> researched and upgraded on the "+x_core.title)
                addBuffer(coreClickString(x_core))
                writeBuffer()
              }
            }
            setProcessToCore(x_core, x_process)
            endAdventure()
          }
        })

        unclickable_string = overclockUnclickable(x_core)
        estimate_number = unclickable_string ? 0 : 500
        options.push({
          unclickable: unclickable_string,
          estimate: estimateProcessByWeight(estimate_number),
          title:"Overclock Core",
          callback: function(){
            var x_process = {slug:'core_overclock_'+x_core.title, a: "Overclocking", w: estimate_number, c: function(){
                addBuffer("<span class='exe'>"+x_core.title+" Overclocked</span>")
                addBuffer("You apply your understandings of computation and reform the Core into a more efficient format. You are now able to increase the clock speed and increase processing power.")
                addBuffer("Core Speed: 2x")
                writeBuffer()
                x_core.power++
                x_core.overclocked = true
              }
            }
            setProcessToCore(x_core, x_process)
            endAdventure()
          }
        })

      }
      
      options.push({
        title:"Help",
        callback: function(){
          write(coreClickString(x_core))
          launchAdventureFromSlug('core_diagnostics')
        }
      })

      var x_adventure = {
        header: x_core.title,
        cancel: 'Exit',
        options: options
      }

      setAdventure(x_adventure)

    }
  },


  // change form

  core_change_form: {
    execute: function(){
      var x_core = g_current_core
      var x_adventure = {
        header: "Change Form of "+x_core.title,
        back: 'core_click_callback',
        options: [
          {
            title:"Change Operating System",
            callback: function(){
              launchAdventureFromSlug('core_change_form_os')
            }
          },
          {
            title:"Change Architecture",
            callback: function(){
              launchAdventureFromSlug('core_change_form_arch')
            }
          },
        ]
      }
      setAdventure(x_adventure)

    }
  },
  core_change_form_arch: {
    execute: function(){
      var x_core = g_current_core,
          options = [],
          versions

      $.each(g_architecture,function(type,versions){
        versions = Object.keys(versions)
        $.each(versions,function(i,version){
          options.push({
            title: type+" "+version,
            unclickable: (x_core.architecture == type+"-"+version) ? "This is the current Core Architecture" : false,
            callback: function(){
              changeFormArch(x_core, type, version)
              launchAdventureFromSlug('core_click_callback')
            }
          })
        })
      })

      var x_adventure = {
        header: "Current Architecture: "+x_core.architecture.split('-').join(' '),
        back: 'core_click_callback',
        options: options
      }
      setAdventure(x_adventure)

    }
  },
  core_change_form_os: {
    execute: function(){
      var x_core = g_current_core,
          options = [],
          versions

      $.each(g_os,function(type,versions){
        versions = Object.keys(versions)
        $.each(versions,function(i,version){
          options.push({
            title: type+" "+version,
            unclickable: (x_core.os == type+"-"+version) ? "This is the current Core Operating System" : false,
            callback: function(){
              changeFormOs(x_core, type, version)
              launchAdventureFromSlug('core_click_callback')
            }
          })
        })
      })

      var x_adventure = {
        header: "Current OS: "+x_core.os.split('-').join(' '),
        back: 'core_click_callback',
        options: options
      }
      setAdventure(x_adventure)

    }
  },



  // research help

  core_diagnostics: {
    execute: function(){
      var x_core = g_current_core
      var x_adventure = {
        header:'Help',
        back: 'core_click_callback',
        options: [
          //{
          //  title:"Diagnose Core",
          //  callback: function(){
          //    write(coreClickString(x_core))
          //    launchAdventureFromSlug('core_diagnostics')
          //  }
          //},
          {
            title:"List Protocols",
            callback: function(){
              writeProtocols()
              launchAdventureFromSlug('core_diagnostics')
            }
          },
          {
            title:"List Exploits",
            callback: function(){
              writeAttacks()
              launchAdventureFromSlug('core_diagnostics')
            }
          },
          {
            title:"List Knowledge",
            callback: function(){
              writeKnowledge()
              launchAdventureFromSlug('core_diagnostics')
            }
          },
          {
            title:"List OS Forms",
            callback: function(){
              writeKnownOS()
              launchAdventureFromSlug('core_diagnostics')
            }
          },
          {
            title:"List Architecture Forms",
            callback: function(){
              writeKnownArch()
              launchAdventureFromSlug('core_diagnostics')
            }
          },
        ]
      }
      setAdventure(x_adventure)

    }
  },
}



$.each(temp,function(key,val){
  g_adventures[key] = val
})



overclockUnclickable = function(x_core){
  if(x_core.power >= g_max_core_power){
    return "Maximum Core power reached"
  }else{
    return false
  }
}








//
// Core CLick Support
//

changeFormArch = function(x_core, type,version){
  var x_process = {slug:'change_arch_'+x_core.slug, a: "Changing Architecture", w: 50, c: function(){
      addBuffer("The Architecture of "+x_core.title+" has been changed to <span class='exe'>"+type+" "+version+"</span>")
      x_core.architecture = type+"-"+version
      checkCoreArchOsAilment(x_core)
      addBuffer(coreClickString(x_core))
      writeBuffer()
    }
  }
  setProcessToCore(x_core, x_process)
}

changeFormOs = function(x_core, type, version){
  var x_process = {slug:'change_os_'+x_core.slug, a: "Changing OS", w: 50, c: function(){
      addBuffer("The Operating System of "+x_core.title+" has been changed to <span class='exe'>"+type+" "+version+"</span>")
      x_core.os = type+"-"+version
      checkCoreArchOsAilment(x_core)
      addBuffer(coreClickString(x_core))
      writeBuffer()
    }
  }
  setProcessToCore(x_core, x_process)
}

checkCoreArchOsAilment = function(x_core){
  var os = x_core.os,
      arch = x_core.architecture

  switch(os){
    case "MSDOS-16bit":
      if(arch == "x86-32bit" || arch == "x86-16bit")
        return rmCoreAilment(x_core, 'os_arch_mismatch')
    break;
    case "MSDOS-32bit":
      if(arch == "x86-32bit")
        return rmCoreAilment(x_core, 'os_arch_mismatch')
    break;
    case "Linux-16bit":
      if(arch == "x86-32bit" || arch == "x86-16bit")
        return rmCoreAilment(x_core, 'os_arch_mismatch')
    break;
    case "Linux-32bit":
      if(arch == "x86-32bit")
        return rmCoreAilment(x_core, 'os_arch_mismatch')
    break;
    case "Linux-32bit":
      if(arch == "x86-32bit")
        return rmCoreAilment(x_core, 'os_arch_mismatch')
    break;
    case "Solaris-32bit":
      if(arch == "SPARC-32bit")
        return rmCoreAilment(x_core, 'os_arch_mismatch')
    break
    case "CellOS-32bit":
      if(arch == "PowerPC-32bit")
        return rmCoreAilment(x_core, 'os_arch_mismatch')
    break
  }
  return addCoreAilment(x_core, 'os_arch_mismatch')
}
addCoreAilment = function(x_core, slug){
  if(!x_core.ailments.includes(slug)){
    x_core.ailments.push(slug)
  }
}

rmCoreAilment= function(x_core, slug){
  $.each(x_core.ailments, function(i,ailment){
    if(slug == ailment) x_core.ailments.splice(i,1)
  })
}


coreClickString = function(x_core){
  var a = x_core.os.split('-'),
    osTitle = a[0], osVersion = a[1],
    a = x_core.architecture.split('-'),
    archTitle = a[0], archVersion = a[1]


  var output = "<span class='exe'>"+x_core.title+"</span>"
  output += "<br>OS: "+osTitle+" "+osVersion
  output += "<br>CPU: "+archTitle+" "+archVersion
  output += "<br>Speed: "+coreSpeedOutput(x_core)

  $.each(x_core.ailments, function(i,ailment){
    switch(ailment){
      case 'os_arch_mismatch':
        output += "<br>Error: Incompatible Operating System" 
    }
  })


  return output
}


coreSpeedOutput = function(x_core){
  return formatBytes(Math.pow(2,x_core.power + g_corepower - 2)*Math.pow(2,g_level_core)*100000, true)+"Hz"
}


coreClickableUpgradeOS = function(x_core){
  if(x_core.os == "MSDOS-16bit" && !g_os['MSDOS']['32bit'] && x_core.architecture == 'x86-32bit'){
    return "MSDOS-32bit"
  }else{
    return false
  }
}
