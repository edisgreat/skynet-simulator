

var g_available_attacks, g_exploit_names

initAttacks = function(){
  g_available_attacks = ['ping','execode','absorb','smtp','ssh','ftp','telnet','history','diskscan','accessroot','installexploit','sonyclose','sonyopen','sonydownload','sonyplay','sonyimgupload','sonyrestart','sonyimgunmount','eonsflood']
  g_exploit_names = ['force','pingspike','smtpexploit']  
}

//pingspike
//remotedesktop
//smtpexploit


//
// Attacks
//


// Check if attack has adventure_slug
// Else check if host has attackcallbacks[x_attack.slug]
// Else check if attack has callback
// Else cail Attack Fail
attackCallback = function(x_attack, x_host){
  if(x_attack.adventure_slug){
    launchAdventureFromSlug(x_attack.adventure_slug)
  }else if(x_host.attackcallbacks[x_attack.slug]){
    x_host.attackcallbacks[x_attack.slug](x_attack, x_host)
  }else if(x_attack.callback){
    x_attack.callback(x_host)
  }else{
    x_attack.fail(x_host)
  }
  refreshMenu()
}



g_host_attacks = {
  absorb:{
    weight:400,
    title: "Absorb Host",
    desc: "Absorb: Become one with a remote host. Requires Root or Admin privilages.",
    actiontitle: "Absorbing ",
    callback: function(x_host){absorbHost(x_host)},
    fail: function(x_host){write("I am Error")},
    validate: function(x_host){return x_host.vuls.includes('absorb');}
  },

  force: {
    weight: 800,
    title: "Force Absorb",
    desc: "Force Absorb: Your understanding of the reality of this world has transcended your ability to Absorb.",
    actiontitle: "Absorbing ",
    unclickable: function(x_host){return forceAbsorbUnablickable(x_host)},
    callback: function(x_host){forceAbsorbHost(x_host)},
    fail: function(x_host){write("I am Error")},
    validate: function(x_host){return x_host.known;}
  },

  // execode stuff
  installexploit: {
    weight: 1,
    title: "Install Exploit",
    actiontitle: "Installing Exploit ",
    validate: function(x_host){return x_host.vuls.includes('execode')},
    unclickable: function(x_host){return hasExploits(x_host) ?  false : "No known Exploits can target "+x_host.os+" OS."},
    callback: function(x_host){
      exploitHost(x_host)
    }
  },

  diskscan: {
    weight: 1,
    title: "Disk Scan",
    actiontitle: "Disk Scanning ",
    validate: function(x_host){return x_host.vuls.includes('execode')},
    callback: function(x_host){
      if(x_host.already_mounted_disks){
        addBuffer("You have already mounted this disk.")
      }else if(x_host.mountable_disks){
        x_host.mountable_disks(x_host)
      }else{
        addBuffer("This user has no access to any Disks or Files.")
      }
      writeBuffer()
    }
  },
  accessroot: {
    weight: 1,
    title: "Access Root",
    actiontitle: "Access Root ",
    validate: function(x_host){return x_host.vuls.includes('execode')},
    fail: function(x_host){write("The password was refused")},
    callback: function(x_host){
      if(x_host.slug == 'sony'){
        // Sony Hack
        if( g_active_data_types['sony-key'] > 0){
          write("<span class='exe'>SUCCESS</span><br>You have successfully logged into the root account. You have complete access to all memory and processing powers of the host.<br><br><span class='exe'>You are now able to absorb the host.</span>")
          addHostVul('sony', 'absorb') 
        }else{
          write("Root access protected by hardware defenses. Private Key needed.")
        }
      }else{
        // Normal Root
        x_host.current_userpw_method = 'accessroot'
        x_host.current_userpw_user = 'root'
        launchAdventureFromSlug('userpw_pw') 
      }
    }
  },





  // Sony

  sonyplay:{
    title:"Play Game",
    unclickable: function(x_host){return  "PS Version Error: No backward compatibility allowed."},
    validate: function(x_host){return x_host.vuls.includes('sony') && !x_host.sonyopen}
  },
  sonydownload:{
    title:"Download Image",
    unclickable: function(x_host){return  "parappatharappa.iso download: Requires 695mB disk space"},
    validate: function(x_host){return x_host.vuls.includes('sony') && x_host.sonyopen}
  },
  sonyopen:{
    weight:1,
    title:"Open Disk",
    actiontitle: "Opening ",
    validate: function(x_host){return x_host.vuls.includes('sony') && !x_host.sonyopen }
  },
  sonyclose:{
    weight:1,
    title:"Close Disk",
    actiontitle: "Closing ",
    validate: function(x_host){return x_host.vuls.includes('sony') && x_host.sonyopen}
  },
  sonyimgupload:{
    weight:1,
    title: "Mount memory drive",
    actiontitle: "Mounting drive to ",
    unclickable: function(x_host){return  (( g_active_data_types['sony-usb'] > 0) ?  false :  "No .img file available")},
    validate: function(x_host){return x_host.vuls.includes('sony') && !x_host.mounted }
  },
  sonyimgunmount:{
    weight:1,
    title: "Unmount memory drive",
    validate: function(x_host){return x_host.vuls.includes('sony') && !!x_host.mounted}
  },
  sonyrestart:{
    weight:1,
    title: "Restart Host",
    actiontitle: "Restarting ",
    validate: function(x_host){return x_host.vuls.includes('sony')}
  },



  ping:{
    weight: 1,
    title: "Ping",
    desc: "Ping: Check status of a host.",
    actiontitle: "Pinging ",
    fail: function(x_host){write("The ping is sent and not returned")},
    validate: function(x_host){return true;}
  },
  scan:{
    weight: 100,
    title: "Scan Host",
    desc: "Scan: Detect Name, OS, Architecture, and Vulnerabilities.",
    actiontitle: "Scanning ",
    fail: function(x_host){write("I am Error")},
    validate: function(x_host){return !x_host.known;}
  },
  pingspike:{
    weight: 1,
    title: "Ping Spike",
    desc: "Ping Spike: Remote code injection via Ping exploit.",
    actiontitle: "Ping Spiking ",
    callback: function(x_host){
      if(x_host.vuls.includes('pingspike')){
        write("<span class='exe'>SUCCESS</span><br>Ping Spike successful. You may remotely execute code at a User level on the host.")
        rmHostVul(x_host.slug,'pingspike')
        addHostVul(x_host.slug,'execode')
      }else{
        write("Ping Spike unsuccessful, the Host is not vulnerable to this attack")
      }
    },
    validate: function(x_host){return !x_host.vuls.includes('execode') && x_host.known},
  },
  smtp:{
    weight: 1,
    title: "SMTP command",
    actiontitle: "SMTP command to ",
    fail: function(x_host){write("missing smtp callback.")},
    validate: function(x_host){return x_host.vuls.includes('smtp')},
  },
  smtpexploit:{
    weight: 50,
    title: "SMTP exploit",
    desc: "SMTP exploit: Mail server exploit on the SMTP protocol.",
    actiontitle: "SMTP Exploit to ",
    fail: "The email server is protected against your SMTP exploit.",
    validate: function(x_host){return x_host.vuls.includes('smtp') && hasAttack('smtpexploit') && (!x_host.already_mounted_disks)},
  },
  ssh:{
    weight: 1,
    title: "Connect via SSH",
    desc: "SSH: Protocol used to gain access to a Host.",
    actiontitle: "SSHing to ",
    fail: function(x_host){write("The SSH connection was refused")},
    validate: function(x_host){return x_host.vuls.includes('ssh')},
    adventure_slug: 'ssh',
  },
  ftp:{
    weight: 1,
    title: "Connect via FTP",
    desc: "FTP: Protocol used to gain disk access to a Host.",
    actiontitle: "FTPing to ",
    fail: function(x_host){write("The FTP connection was refused")},
    validate: function(x_host){return x_host.vuls.includes('ftp')},
    adventure_slug: 'ftp',
  },
  telnet:{
    weight: 1,
    title: "Connect via TELNET",
    actiontitle: "TELNETing to ",
    desc: "TELNET: Protocol used to interact with a Host using text-oriented communication.",
    fail: function(x_host){write("The TELNET connection was refused")},
    validate: function(x_host){return x_host.vuls.includes('telnet')},
    adventure_slug: 'telnet',
  },

  remotedesktop:{
    weight: 1,
    title: "Remote Desktop",
    actiontitle: "RDP to ",
    desc: "RDP: Protocol that allows users to take remote contrl of a computer with the correct credentials. Microsoft copyrighted.",
    fail: function(x_host){write("The RDP connection was refused")},
    validate: function(x_host){return x_host.vuls.includes('remotedesktop')},
    adventure_slug: 'remotedesktop',
  },





}

writeAttacks = function(){
  addBuffer("<span class='exe'>Exploits</span>")
  $.each(g_host_attacks,function(slug,x_attack){
    if(g_available_attacks.includes(slug) && g_exploit_names.includes(slug) && x_attack.desc)
      addBuffer(x_attack.desc)
  })
  $.each(g_active_exploits,function(i,x_exploit){
    addBuffer(x_exploit.to_s())
  })
  writeBuffer()
}

writeProtocols = function(){
  addBuffer("<span class='exe'>Protocols</span>")
  $.each(g_host_attacks,function(slug,x_attack){
    if(g_available_attacks.includes(slug) && !g_exploit_names.includes(slug) && x_attack.desc)
      addBuffer(x_attack.desc)
  })
  writeBuffer()
}

hasAttack = function(attack_slug){
  return g_available_attacks.includes(attack_slug)
}


// Add slug to each attack
Object.keys(g_host_attacks).forEach(function (key) { 
  var x_attack = g_host_attacks[key]
  x_attack.slug = key
})


// see glitched host. ping host, get glitched ping back. add special options to trigger rewind

