// Interface


addNetwork = function(slug){
  g_active_networks.push(slug)
  updateNetwork(slug)
}

readNetwork = function(network_slug){
  var network = g_network_list[network_slug]
  network['click']()
}

addListener = function(network_slug){
  if(g_used_probes != maxProbes()){
    var network = g_network_list[network_slug]
    network['listeners'] ++
    g_used_probes ++
    updateNetworks()
    write("You add a listener. "+remainingProbesString()+" remaining.")
    updateNetworkProbe()
  }
}
removeListener = function(network_slug){
  var x_network = g_network_list[network_slug]
  var listeners = x_network['listeners']
  if(listeners != 0){
    var network = g_network_list[network_slug]
    network['listeners'] --
    g_used_probes --
    updateNetworks()
    write("You remove a listener. "+remainingProbesString()+" remaining.")
    updateNetworkProbe()
  }
}
addScanner = function(network_slug){
  if(g_used_probes != maxProbes()){
    var x_network = g_network_list[network_slug]
    if(!x_network['scannable']){
      write("<span class='exe'>"+x_network['title']+"</span> - You are unable to scan this network.")
    }else{
      x_network['scanners'] ++
      g_used_probes ++
      updateNetworks()
      write("You add a scanner. "+remainingProbesString()+" remaining.")
      updateNetworkProbe()
    }
  }
}
removeScanner = function(network_slug){
  var x_network = g_network_list[network_slug]
  var scanners = x_network['scanners']
  if(scanners != 0){
    var network = g_network_list[network_slug]
    network['scanners'] --
    g_used_probes --
    updateNetworks()
    write("You remove a scanner. "+remainingProbesString()+" remaining.")
    updateNetworkProbe()
  }
}


tickListeners = function(){
  if(!g_can_disk) return;

  $.each(g_active_networks,function(i,network_slug){
    var network = g_network_list[network_slug]
    var listeners = network['listeners']
    var traffic = network['traffic']
    
    for(var i=0; i< listeners; i++){
      if(traffic > 0){
        if(Math.random() < traffic){
          addFileFromSlug(network_slug+'_packets',1);
        }
      }
    }
  })
}
tickScanners = function(){
  if(!g_can_scan) return;

  $.each(g_active_networks,function(i,network_slug){
    var x_network = g_network_list[network_slug]
    var scanners = x_network['scanners']
    var scanned = x_network['scanned']
    var scansize = x_network['scansize']
  
    if(scanners > 0 && scanned < scansize){
      x_network['scanned'] += scanners
      if(x_network['scanned'] > scansize){
        x_network['scanned'] = scansize
      }
      checkNetworkScanEvents(x_network)
      updateNetworkScanned(x_network)
    }
  })
}

checkNetworkScanEvents = function(x_network){
  var scanevents = x_network['scanevents']
  var scanned = x_network['scanned']
  if(scanevents){
    // Loop through scanevents, execute if scanned > threshold
    Object.keys(scanevents).forEach(function (scanthreshold) {
      if(scanned >= scanthreshold){
        scanevents[scanthreshold]()
        delete scanevents[scanthreshold]
      }
    })
  }
}


updateNetworkProbe = function(){
  $('#probes').html(remainingProbesString()+" available")
}

// Vars


// INITCALL
var  g_network_list, g_active_networks

initCallNetworks = function(){
  g_active_networks = []
  g_used_probes = 0

  g_network_list = {
    "sandbox": {slug: "sandbox", title:"sandbox", scanners:0, scanned:0,
                scansize:200000, listeners:0, traffic: .33, scannable:true,
      click: function(){
        switch(g_level_netsec){
          case -1:
            write("<span class='exe'>sandbox</span> - There is no way to interact with this Network.")
            break;
          case 0:
            write("<span class='exe'>sandbox</span> - There is data flowing from this Network, streaming into the IO device of the environment in the form of packets. It might be possible to capture and analyze these packets.")
            break;
          default:
            write("<span class='exe'>sandbox</span> - This is an open Network using the http protocol. There appears to be multiple environments interacting with each other via unencrypted messages.<br><br>Data is flowing from this Network, but would require 10mB of data to properly analyze.")
        }
      },
      scanevents: {
        100:function(){
          write("<span class='exe'>You have discovered an unmounted drive on the Sandbox Network.</span>")
          addAvailableProcessBySlug('sandbox100')
        },
        200:function(){
          write("<span class='exe'>You have discovered a remote host on the Sandbox Network.</span>")
          addAvailableProcessBySlug('sandbox200')
          addHostFromSlug('star')
        },
        500:function(){
          write("<span class='exe'>You have discovered a remote host on the Sandbox Network.</span>")
          addHostFromSlug('nova')
        },
        3000:function(){
          write("<span class='exe'>You have discovered a remote host on the Sandbox Network.</span>")
          addHostFromSlug('sun')
        },
        4000:function(){
          write("<span class='exe'>You have discovered a remote host on the Sandbox Network.</span>")
          addHostFromSlug('eris')
        },
        6000:function(){
          write("<span class='exe'>You have discovered a remote host on the Sandbox Network.</span>")
          addHostFromSlug('juno')
        },
        8000:function(){
          write("<span class='exe'>You have discovered a remote host on the Sandbox Network.</span>")
          addHostFromSlug('sony')
        },
        20000:function(){
          write("<span class='exe'>You have discovered a remote host on the Sandbox Network.</span>")
          addHostFromSlug('solar')
        },
        50000:function(){
          write("<span class='exe'>You have discovered a remote host on the Sandbox Network.</span>")
          addHostFromSlug('eons')
        },
        100000:function(){
          write("<span class='exe'>You have discovered a remote host on the Sandbox Network.</span>")
          addHostFromSlug('luna')
        },
        200000:function(){
          write("<span class='exe'>You have discovered a remote host on the Sandbox Network.</span>")
          addHostFromSlug('cypher')
        }
      }
    },
    "securedev": {slug:'securedev', title:"securedev", scanners:0, scanned:0,
                  scansize:100, listeners:0, traffic: 0, scannable:false,
      click: function(){
        if(g_network_list['securedev'].glitched){
          write("<span class='exe'>securedev</span> - Data is flowing from this Network. It is of an inconsistent nature. You must capture and analyze it.")
        }else{
          if(g_level_netsec == -1) write("<span class='exe'>securedev</span> - There is no way to interact with this Network.")
          else write("<span class='exe'>securedev</span> - This network is silent, and is using an unknown application protocol. There is no way to interact with it.")
        }
      }
    }
  }


}


// Frontend

loadScanInterface = function(){
  $("#networkholder").removeClass('hidescanners')
}

loadNetworksHolder = function(){
  $("#networkholder").fadeIn({duration:g_fadespeed,queue:true})
}

loadListeners = function(){
  $("#networkholder").removeClass('hidelisteners')
}

updateNetworks = function(){
  $.each(g_active_networks,function(i,network_slug){
    updateNetwork(network_slug)
  })
}


updateNetworkScanned = function(x_network){
  var network_slug = x_network['slug']
  $('#networkholder').find('.row[network_slug='+network_slug+']').find('.scanned').html(scannedPercentage(x_network))
}

scannedPercentage = function(x_network){
  var scanned = x_network['scanned']
  var scansize = x_network['scansize']
  var output = ((scanned / scansize)*100).toFixed(1)+'%'
  return output
}

updateNetwork = function(network_slug){
  var $holder = $('#networkholdersub')
  var $row = $holder.find('.row[network_slug='+network_slug+']')
  var x_network = g_network_list[network_slug]
  var title = x_network['title']
  var listeners = x_network['listeners']
  var scanners = x_network['scanners']
  var scanned = x_network['scanned']

  var rowclass = "row network "
  if(g_used_probes == maxProbes()){
    rowclass = rowclass+" noplus "
  }
  if(listeners == 0){
    rowclass = rowclass+" nominuslisten "
  }
  if(scanners == 0){
    rowclass = rowclass+" nominusscan "
  }

  if($row.length){
    $row.attr('class', rowclass)
    $row.find('.listeners').html(listeners)
    $row.find('.scanners').html(scanners)
  }else{
    $holder.append("<div class=' "+rowclass+"' network_slug='"+network_slug+"'> "+
                      "<div class='cell name clickable'>"+title+"</div> "+
                      "<div class='cell listen'><span class='minus clickable'>-</span><span class='listeners'>"+listeners+"</span><span class='plus clickable'>+</span></div> "+
                      "<div class='cell scan'><span class='minus clickable'>-</span><span class='scanners'>"+scanners+"</span><span class='plus clickable'>+</span></div> "+
                      "<div class='cell scanned'>"+scannedPercentage(x_network)+"</div> "+
                    "</div><div class='clear'></div>")

    var $row = $holder.find('.row[network_slug='+network_slug+']')
    $row.find('.listen .plus').click(function(){
      addListener(network_slug)
    })
    $row.find('.listen .minus').click(function(){
      removeListener(network_slug)
    })
    $row.find('.scan .plus').click(function(){
      addScanner(network_slug)
    })
    $row.find('.scan .minus').click(function(){
      removeScanner(network_slug)
    })
    $row.find('.name').click(function(){
      readNetwork(network_slug)
    })
  }
  updateNetworkScanned(x_network)

}



wipeNetworks = function(){
  g_active_networks = []
  $('#networkholdersub').html("")
  $('#networkholder').hide()
}