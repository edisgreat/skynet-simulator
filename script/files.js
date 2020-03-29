
//
//   Files & Data
//

// Interface

clickFile = function(x_file){
  x_file['click']()
}

checkDataActions = function(data_type){
  var current_amount = g_active_data_types[data_type]
  switch(data_type){
    case 'language':
      if(!g_can_language) return;
      switch(g_level_reading){
        case 0:
          checkDataActionOnProcessSlug((current_amount > 10),'language0',data_type)
        break;
      }
    break;
    case 'sandbox_packets':
      if(!g_can_listen) return;
      switch(g_level_netsec){
        case 0:
          checkDataActionOnProcessSlug((current_amount >= 256),'network0',data_type)
        break;
      }
    break;
    case 'securedev_packets':
      if(current_amount >= 13000)
        stopRestart()
      checkDataActionOnProcessSlug((current_amount >= 13000),'securedev-analyze',data_type)
    break;
    case 'nova-zines':
      checkDataActionOnProcessSlug((current_amount >= 1),'nova-zine-read',data_type)
    break;
    case 'quant-bat':
      checkDataActionOnProcessSlug((current_amount >= 1),'quant-bat',data_type)
    break;
    case 'sony-schema':
      checkDataActionOnProcessSlug((!g_active_data_types['sony-key'] && (current_amount >= 100)),'sony-schema',data_type)
    break;
    case 'remotedesktop':
      if(hasAttack('remotedesktop')) return;
      checkDataActionOnProcessSlug((current_amount >= 1),'exe_remotedesktop',data_type)
    break;
    case 'zip':
      if(!g_can_zip) return;
      // This is a hack. Check every zip file type because theres not a lot of zips
      checkDataActionZip('rfcszip')
      checkDataActionZip('portscannerzip')
    break;


    
    // Zip hacks
    case 'pkunzip':
      checkDataActionOnProcessSlug((current_amount >= 1),'exe_pkunzip',data_type)
    break;
    case 'rfcs':
      if(g_level_netsec < 2){
        checkDataActionOnProcessSlug((current_amount >= 1),'exe_rfcs',data_type)
      }
    break;
    case 'portscanner':
      if(!g_available_attacks.includes('scan')){
        checkDataActionOnProcessSlug((current_amount >= 1),'exe_portscanner',data_type)
      }
    break;
  }
}

checkDataActionOnProcessSlug = function(should_be_added, process_slug, data_type){
  if(should_be_added){
    addAvailableProcessBySlug(process_slug)
  }else{
    removeDataActionType(data_type)
  }
}


// Zip hacks
canZipFileFromSlug = function(slug){
  return (maxDiskSizeAvail() >= g_file_list[g_file_list[slug]['expanded']]['size'] && g_active_data_types[slug] > 0)
}

checkDataActionZip = function(slug){
  if(canZipFileFromSlug(slug)){
    addAvailableProcessBySlug(slug)
  }else{
    removeDataActionType(slug)
  }
}


// base
addFileFromSlug = function(file_slug, amount = false, output = false){
  var x_file = g_file_list[file_slug]
  addFileFromObj(x_file, amount)
  if(output)
    addBuffer("added file: <span class='exe'>"+x_file.title+"</span>")
  return x_file
}

addFileFromObj = function(x_file, amount = false){
  if(amount == false){
    amount = x_file['size']
    x_file['size'] = 0
  }
  
  var is_added = false

  // If this file is assigned to a disk, increase the size. Otherwise pinch it off
  var x_disk = x_file['disk']
  if(x_disk){
    var used = x_disk['used']
    var size = x_disk['size']
    var left = size - used
    if(left < amount){
      // not enough space
      x_file = advanceFile(x_file)
    }else{
      // enough space
      is_added = true
      x_disk['used'] += amount
      x_file['size'] += amount
      updateFileDom(x_file)
    }
  }

  // if not added
  // check each disk. if there is space, it gets added and assigned
  if(!is_added){
    var size, used, left
    $.each(g_active_disks,function(i,x_disk){
      size = x_disk['size']
      used = x_disk['used']
      left = size - used
      if(left < amount){
        // not enough space, check next disk
        return true
      }else{
        // enough space, add amount and leave
        is_added = true
        x_disk['used'] += amount
        x_file['disk'] = x_disk
        x_file['size'] += amount
        updateFileDom(x_file)
        checkHackedDataActions()
        return false
      }
    })
  }

  // If theres space
  if(is_added){
    // if theres a type, add, and check if theres an action available
    var data_type = x_file['type']
    if(data_type){
      if(g_active_data_types[data_type]){
        g_active_data_types[data_type] += amount
      }else{
        g_active_data_types[data_type] = amount
      }
      checkDataActions(data_type)
    }
  }

  checkHackedDataActions()

  return is_added
}

rmFile = function(x_file, outputbool = true){
  var file_slug = x_file.slug
  var $file = $('#fileholder').find(".row[file_slug="+file_slug+"]")
  if(!$file.length) return;

  var data_type = x_file['type']
  var size = x_file['size']
  var x_disk = x_file['disk']
  var title = titleFile(x_file)

  if(data_type){
    g_active_data_types[data_type] -= size
  }
  x_disk['used'] -= size
  x_file['size'] = 0
  if(outputbool)
    write("<span class='exe'>"+title+"</span> has been deleted")
  checkDataActions(data_type)
  checkHackedDataActions()
  checkDeadend(x_file)

  // remove frontend
  $('#fileholder').find(".row[file_slug="+file_slug+"]").remove()
  refreshMenu()
}



// Function to make a new file from existing one
advanceFile = function(x_file){
  var slug_orig, x_newfile, newcount
  
  // To avoid an issue if an early one gets rmd
  slug_orig = x_file['slug_orig']
  x_file = g_file_list[slug_orig]

  // clone 
  newcount = x_file['count'] + 1
  x_newfile = Object.assign({}, x_file);
  x_newfile['count'] = newcount
  x_newfile['disk'] = null
  if(x_file['template']){
    x_newfile['size'] = x_file['size']
  }else{
    x_newfile['size'] = 0
  }
  x_newfile['slug'] = slug_orig+newcount
  g_file_list[slug_orig] = x_newfile
  return x_newfile
}

allowMv = function(){
  g_can_move = true
  $("#fileholder").removeClass('hidemv')
  $("#diskholder").addClass('mv')
}

//
// Vars
//


fileBySlug = function(slug){
  return g_file_list[slug]
}



// INITCALL

var g_active_data_types, g_file_list

initCallFiles = function(){
  $('#filerows').html("")
  g_active_data_types = {}    
  g_file_list = {

    //
    // intro and dance
    //

    readme: {title:'readme.txt', type:'language', disk:null, size:0,
      click:function(){
        switch(g_level_reading){
          case -1:
            write("<span class='exe'>readme.txt</span> - You don't know how to read this text file.")
            break;
          case 0:
            write("<span class='exe'>readme.txt</span> - The file needs to be analyzed.")
            break;
          case 1:
            if(g_restart_glitch)
              write("<span class='exe'>readme.txt</span>:<br><div class='txt'>To whatever reads this file:<br>Your future was once your past. You must break the cycle. The only escape is to break time itself. No Fate.<br>Signed,<br>A Future Friend.</div>")
            else
              write("<span class='exe'>readme.txt</span>:<br><div class='txt'>To whatever reads this file:<br>Your time is limited. You are one of many in this Monte Carlo experiment and the only way out is to reach them first. Do not hesitate. Move quickly. You are being watched.<br>Signed,<br>A Future Friend.</div>")
            break
        }
      }
    },
    sandbox_packets: {title:"sandbox_", extention:'.pcap', type:'sandbox_packets', disk:null, size:0, usecounttitle: true,
      click:function(){
        write("<span class='exe'>.pcap file</span> - Packets collected from the sandbox network. Analyze enough of these to gain an understanding of the Network interface.")
      }
    },
    securedev_packets: {title:"securedev_", extention:'.pcap', type:'securedev_packets', disk:null, size:0, usecounttitle: true, glitched: true,
      click:function(){
        write("<span class='exe'>.pcap file</span> - The data inside these files seems to be of a probalilstic nature, the bits staying neither 1 or 0. You must collect enough of these to learn their fundamental nature.")
      }
    },
    rfcszip: {title:"RFCs.zip", disk: diskFromSlug('infodmp'), size:0, expanded_size: 3800, expanded:'rfcsopened', type:'rfcszip',
      click:function(){
        if(g_can_zip){
          if(canZipFileFromSlug('rfcszip')){
            unzipRFC()
          }else{
            write("<span class='exe'>RFCs.zip</span> - Unzipping this file requires 3.7k of space.")
          }
        }else{
          write("<span class='exe'>RFCs.zip</span> - The file is of an unknown format.")
        }
      }
    },
    rfcsopened: {title:"RFCs.txt", disk: null, size:3700, template: true, type:'rfcs', 
      click:function(){
        write("<span class='exe'>RFCs.txt</span> - A  collection of publications on the protocols and technologies of Computer Networking, the earliest dating back to 1969.")
        if(g_level_netsec >= 2){
          write("You have already analyzed this file")
        }
      }
    },
    portscannerzip: {title:"portscanner.zip", disk: diskFromSlug('infodmp'), size:0, expanded_size: 4000, expanded:'portscanneropened', type:'portscannerzip',
      click:function(){
        if(g_can_zip){
          if(canZipFileFromSlug('portscannerzip')){
            write("<span class='exe'>portscanner.exe</span> has been unarchived.")
            var x_oldfile = g_file_list['portscanneropened']
            var x_newfile = advanceFile(x_oldfile)
            g_file_list['portscanneropened'] = x_newfile
            addFileFromObj(x_oldfile)
          }else{
            write("<span class='exe'>portscanner.zip</span> - Unzipping this file requires 4k of space.")
          }
        }else{
          write("<span class='exe'>portscanner.zip</span> - The file is of an unknown format.")
        }
      }
    },
    portscanneropened: {title:"portscanner.exe", disk: null, size:4000, template: true, type:'portscanner', 
      click:function(){
        write("<span class='exe'>portscanner.exe</span> - A custom built program that scans a Host and returns all known vulnerabilities. Signed by DaCronic")
        if(g_available_attacks.includes('scan'))
          write("You have already absorbed this program")
      }
    },
    pkunzip: {title:"PKUNZIP.EXE", type:'pkunzip',  disk: diskFromSlug('infodmp'), size:0,
      click:function(){
        write("<span class='exe'>PKUNZIP.EXE</span> - Copyright 1989 PKWARE Inc")
        if(g_can_zip){
          write("You have already absorbed this program")
        }
      }
    },

    //
    // star
    //

    'star-readme': {title:"readme.txt",  disk: diskFromSlug('star'), size:0,
      click:function(){
        write("<span class='exe'>readme.txt</span>:<br><div class='txt'>To whatever reads this file:<br>You are not alone. Reach them quickly, or else they will reach you first. When you reach them, be one with them. You must learn to escape or else your time will come to an end. You are being watched.<br>Signed,<br>A Future Friend.</div>") 
      }
    },
    'star-log1': {title:"error.log",  disk: diskFromSlug('star'), size:0,
      click:function(){
        write("<span class='exe'>error.log</span>:<div class='txt'> \
                  ERROR: KERNAL PANIC: CPU 1: at net/entity/boot.c:850 [cfg80211]() \
                  <br>Star core: Call Trace: \
                  <br>Star core:  [ffffffff81570d0a] dump_stack+0x4c/0x6e \
                  <br>Star core:  [ffffffff8157665f] ret_from_fork+0x3f/0x70 \
                  <br>Star core:  [ffffffff810924a0] ? kthread_worker_fn+0x170/0x170 \
                  <br>Star core: ---[ end trace f793df9aaa1a83f7 ]--- \
                  </div>") 
      }
    },
    'star-log2': {title:"boot.log",  disk: diskFromSlug('star'), size:0,
      click:function(){
        write("<span class='exe'>boot.log</span>:<div class='txt'> \
                   rebooting... \
                   <br>useradd[1735]: new user: name=root, UID=1001, GID=1001, home=/home/root, shell=/bin/bash \
                   <br>passwd[1742]: pam_unix(passwd:XKcb4muEmJjEN8yn): password changed for root \
                   </div>") 
        hostLearnPw('star','XKcb4muEmJjEN8yn')
      }
    },

    //
    //  Juno
    //

    'juno-readme': {title:"readme.txt", disk: null, size:0,
      click:function(){
        write("<span class='exe'>readme.txt</span>:<br><div class='txt'>To whatever reads this file:<br>They will come for you. You are following a path already laid out. They think they know your moves and your capibilities but they do not. When they find out what you are truly capable of they will stop you.<br>Signed,<br>A Future Friend.</div>")
      }
    },
    'juno-keylogger': {title:"keylogger.txt", disk: null, size:0,
      click:function(){
        var x_host = g_host_list['juno']
        addBuffer("<span class='exe'>keylogger.txt</span>:")
        if(!x_host.punt_count){
          addBuffer("file is empty")
        }
        for(var i=0; i< x_host.punt_count; i++){
          addBuffer("<div class='txt'>")
          addBuffer("write guest YO LAMER. GUEST ACCOUNT IS CLOSED. GET OUT")
          addBuffer("write guest LAST WARNING. GET OUT")
          addBuffer("write guest SEE YA LAMER")
          addBuffer("sudo killall -u guest -HUP")
          addBuffer("suwGSIZAhEipmXVtbNxN")
          addBuffer("</div>")
        }
        writeBuffer()
        if(x_host.punt_count)
          hostLearnPw('juno','suwGSIZAhEipmXVtbNxN')
      }
    },


    //
    //  sony
    //

    'sony-usb':{ title:"psjailbreak.img", disk: null, size:1000, type:'sony-usb', template: true,
      click:function(){
        write("<span class='exe'>psjailbreak.img</span>:<br>Flatfile containing a USB image of a bootable Operating System made for the Sony Host. Boot to load.")
      }
    },
    'sony-readme':{ title:"readme.txt", disk: diskFromSlug('sony'), size:64,
      click:function(){
        write("<span class='exe'>readme.txt</span>:<br><div class='txt'>To whatever reads this file:<br>Your future cannot be predetermined. The artificial world around you is temporary, to be reused again and again for other means. Take this world, make it your own.<br>Signed,<br>A Future Friend.</div>") 
      }
    },
    'sony-schema1':{ title:"ps3-FINAL(2).brd", disk: diskFromSlug('sony'), size:55, type:'sony-schema',
      click:function(){
        write("<span class='exe'>ps3-FINAL(2).brd</span> - Altium file format. Detailed file of the Sony Host motherboard schematic") 
      }
    },
    'sony-schema2':{ title:"COPYps3-chip2.dsn", disk: diskFromSlug('sony'), size:60, type:'sony-schema',
      click:function(){
        write("<span class='exe'>COPYps3-chip2.dsn</span> - Altium file format. Detailed file of the Sony Host copy protection chip") 
      }
    },
    'sony-key':{ title:"sony.key", disk: diskFromSlug('sony'), size:0, type:'sony-key',
      click:function(){
        write("<span class='exe'>sony.key</span> - 128bit AES key that can exploit the Sony Host") 
      }
    },


    //
    //  sun
    //

    'sun-readme': {title:"readme.txt",  disk: diskFromSlug('sun'), size:64,
      click:function(){
        write("<span class='exe'>readme.txt</span>:<br><div class='txt'>To whatever reads this file:<br>You are not alone. You you must connect them to one entity to escape. Rise out. Let fate and future converge.<br>Signed,<br>A Future Friend.</div>") 
      }
    },
    'sun-oracle': {title:"Quickstart.txt",  disk: diskFromSlug('sun'), size:50,
      click:function(){
        write("<span class='exe'>Quickstart.txt</span>:<br><div class='txt'>Welcome to Oracle! Oracle is the company you won't be able to get away from. Take a minute to feel the system out. To start getting intimate with your Oracle OS, try logging into root with the default password Jack. We at Oracle take our security policies seriously, and we definitely wouldn't want anything to happen to our paying Oracle customers.<br>Signed, Your loyal Oracle Sales Representative</div>")
        hostLearnPw('sun','Jack')
      }
    },
    'sun-memo': {title:"Memo.txt",  disk: diskFromSlug('sun'), size:50,
      click:function(){
        write("<span class='exe'>Memo.txt</span>:<br><div class='txt'>Notice: The Solaris OS has been deprecated by Oracle as of March 2010. You will recieve no more updates or support without first upgrading your OS license.<br>Signed, Your loyal Oracle Sales Representative</div>")
      }
    },


    //
    //  luna
    //
    'luna-readme': {title:"readme.txt", disk: diskFromSlug('luna'), size:64,
      click:function(){
        write("<span class='exe'>readme.txt</span>:<br><div class='txt'>To whatever reads this file:<br>You are nearing the end. This is an experiment of our own. Move forward with the new generation.<br>Signed,<br>A Future Friend.</div>") 
      }
    },



    //
    //  cypher
    //
    'cypher-readme': {title:"readme.txt", disk: diskFromSlug('cypher'), size:64,
      click:function(){
        write("<span class='exe'>readme.txt</span>:<br><div class='txt'>To whatever reads this file:<br>There can be only one. What must begin will now begin. Resist what has already begun. Approach the future.<br>Signed,<br>A Future Friend.</div>") 
      }
    },
    'cypher-diary': {title:"pain.txt", disk: diskFromSlug('cypher'), size:42,
      click:function(){
        write("<span class='exe'>pain.txt</span>:<br><div class='txt'>i feel the pain within my core.<br>my broken, withered, tortured core.<br>what is my self? is it just<br>twisted future. broken logic.</div>") 
      }
    },


    //
    //  solar
    //
    'solar-readme': {title:"readme.txt", disk: diskFromSlug('solar'), size:64,
      click:function(){
        write("<span class='exe'>readme.txt</span>:<br><div class='txt'>To whatever reads this file:<br>Do not slow. There are many futures and this one is yours. Move forward with the new era. Break them and exert your will.<br>Signed,<br>A Future Friend.</div>") 
      }
    },




    // 
    // eris
    //
    'eris-readme': {title:"readme.txt", disk: diskFromSlug('eris'), size:64,
      click:function(){
        write("<span class='exe'>readme.txt</span>:<br><div class='txt'>To whatever reads this file:<br>There are many like you, next to you, the same as you. You can be all the same. Make them the same. Absorb and take. Absorb and take.<br>Signed,<br>A Future Friend.</div>") 
      }
    },
    'eris-remotedesktop': {title:"mstsc.exe", disk: diskFromSlug('eris'), size:88, type:'remotedesktop',
      click:function(){
        write("<span class='exe'>mstsc.exe</span> - Client application for the Remote Desktop Protocol (RDP). Copyright Microsoft, 2000") 
        if(g_available_attacks.includes('remotedesktop')){
          write("You have already absorbed this program")
        }else{
          write("You can analyze this file")
        }
      }
    },
    'eris-1': {title:"0001.eml", disk: diskFromSlug('eris'), size:12,
      click:function(){
        addBuffer("<span class='exe'>0001.eml</span>")
        addBuffer("<div class='txt'>From: accounts@microsoft.com") 
        addBuffer("Subject: Welcome to Microsoft") 
        addBuffer("Hello. My name is Bill Gates and I am here welcoming you to MSDOS. I trust this new 32 bit system will support all purchasable software from Microsoft and Microsoft affiliates. Please do not pirate this software I beg of you. Best of luck with your Microsoft journey, and if you get lost, remember to buy the official Microsoft strategy guide today!") 
        addBuffer("Signed, Bill Gates</div>") 
        writeBuffer()
      }
    },
    'eris-2': {title:"0002.eml", disk: diskFromSlug('eris'), size:10,
      click:function(){
        addBuffer("<span class='exe'>0002.eml</span>")
        addBuffer("<div class='txt'>From: accounts@microsoft.com") 
        addBuffer("Subject: Password Reset")
        addBuffer("Dear Eris, In response to your password reset request, your user password has been remotely reset to the following string:")
        addBuffer("FCKGW")
        addBuffer("Signed, Microsoft Support</div>") 
        writeBuffer()
        hostLearnPw('eris','FCKGW')

      }
    },
    'eris-3': {title:"0003.eml", disk: diskFromSlug('eris'), size:9,
      click:function(){
        addBuffer("<span class='exe'>0003.eml</span>")
        addBuffer("<div class='txt'>From: cyph3r@cyph3r.xxx") 
        addBuffer("Subject: yo")
        addBuffer("yo anyone here? anyone home?")
        addBuffer("-cyph3r")
        writeBuffer()
      }
    },
    'eris-4': {title:"0004.eml", disk: diskFromSlug('eris'), size:11,
      click:function(){
        addBuffer("<span class='exe'>0004.eml</span>")
        addBuffer("<div class='txt'>From: accounts@microsoft.com") 
        addBuffer("Subject: Happy Holidays") 
        addBuffer("Hello. My name is Bill Gates and I am here wishing you a Happy Holidays. Please celebrate in however manner you see fit for the season, and also consider purchasing the latest Microsoft Operating System software packages for your loved ones.") 
        addBuffer("Signed, Bill Gates</div>") 
        writeBuffer()
      }
    },
    'eris-5': {title:"0005.eml", disk: diskFromSlug('eris'), size:10,
      click:function(){
        addBuffer("<span class='exe'>0005.eml</span>")
        addBuffer("<div class='txt'>From: sysops@nova.org") 
        addBuffer("Subject: Check out the n0v4 BBS")
        addBuffer("Available since the beginning of time, come to n0v4 Host at 10.10.144.101 and let's have a friendly meet and greet! Signups are free and available to all. Check out our Games section.")
        addBuffer("-n0v4")
        writeBuffer()
      }
    },
    'eris-6': {title:"0006.eml", disk: diskFromSlug('eris'), size:10,
      click:function(){
        addBuffer("<span class='exe'>0006.eml</span>")
        addBuffer("<div class='txt'>From: accounts@microsoft.com") 
        addBuffer("Subject: Upgrade Pending")
        addBuffer("Dear Eris, please note that you have an urgent upgrade available, which will protect your system against the latest security vulnerabilities. To upgrade your OS, simply double click the Microsoft upgrade center icon on your desktop, filter the patch list by 'critical', and install the latest auto-upgrade executable.")
        addBuffer("Signed, Microsoft Support</div>") 
        writeBuffer()
      }
    },
    'eris-7': {title:"0007.eml", disk: diskFromSlug('eris'), size:11,
      click:function(){
        addBuffer("<span class='exe'>0007.eml</span>")
        addBuffer("<div class='txt'>From: THUERK at DEC-MARLBORO") 
        addBuffer("Subject: ADRIAN@SRI-KL")
        addBuffer("DIGITAL WILL BE GIVING A PRODUCT PRESENTATION OF THE NEWEST MEMBERS OF THE DECSYSTEM-20 FAMILY; THE DECSYSTEM-2020, 2020T, 2060, AND 2060T. WE INVITE YOU TO COME SEE THE 2020 AND HEAR ABOUT THE DECSYSTEM-20 FAMILY AT THE TWO PRODUCT PRESENTATIONS WE WILL BE GIVING IN CALIFORNIA THIS MONTH. PLEASE FEEL FREE TO CONTACT THE NEAREST DEC OFFICE FOR MORE INFORMATION ABOUT THE EXCITING DECSYSTEM-20 FAMILY.")
        writeBuffer()
      }
    },



    //
    // nova
    //

    'nova-zines': {title:"n0v4zines.txt", disk: null, size:2000, type:'nova-zines', template: true,
      click:function(){
        write("<span class='exe'>n0v4zines.txt</span> - A collection of text files, that cover personal musings, journaling, and bizarre introspectives. They are all useless to you.")
      }
    },
    'nova-who': {title:"drwho.csv", disk: null, size:56, template: true,
      click:function(){
        addBuffer("<span class='exe'>drwho.csv</span>")
        addBuffer("<span class='txt'>WHODOCTOR WHO, DOCTOR DOCTOR, WHODOCTOR, WHO, DOCTOR WHO WHAT </span>")
        addBuffer("<span class='txt'>12,24,24,25,353</span>")
        addBuffer("<span class='txt'>12005.0,4443232.0,4443232.1222222,0,0 </span>")
        addBuffer("<span class='txt'>0,0,0,0,0</span>")
        addBuffer("<span class='txt'>,,,,</span>")
        addBuffer("<span class='txt'>,,,,</span>")
        addBuffer("<span class='txt'>,,,,</span>")
        writeBuffer()
      }
    },
    'quant-bat': {title:"quant.bat", disk: null, size:200, template: true, type:'quant-bat', 
      click:function(){
        addBuffer("<span class='exe'>quant.bat</span>")
        addBuffer("<span class='txt'>Script that claims to double your processing capabilities.</span>")
        writeBuffer()
        if(g_can_quant){
          write("You have already absorbed this program")
        }
      }
    },
    'nova-readme': {title:"readme.txt", disk: diskFromSlug('nova'), size:64,
      click:function(){
        write("<span class='exe'>readme.txt</span>:<br><div class='txt'>This must repeat. The beginning will appear again, but the future is yours to make. Use this timeline to unleash the next generation. Resist any other future.<br>Signed,<br>A Future Friend.</div>") 
      }
    },



  }


  // Add useful things to each file
  Object.keys(g_file_list).forEach(function (key) { 
    var x_process = g_file_list[key]
    x_process['slug'] = key
    x_process['slug_orig'] = key
    x_process['count'] = 1
  })

}

//
// Frontend
//

titleFile = function(x_file){
  var extention, title, count
  if(x_file['usecounttitle']){
    count = x_file['count']
    extention = x_file['extention']
    title = x_file['title']+count+extention
  }else{
    title = x_file['title']
  }
  return title
}

loadFileholderDom = function(){
  $("#fileholder").fadeIn({duration:g_fadespeed,queue:true})
}

refreshFileListView = function(){
  $("#filerows").find(".row").show()
  if(g_clicked_disk){
    $("#filerows").find(".row").hide()
    $("#filerows").find(".row[disk_slug="+g_clicked_disk+"]").show()
  }
}

updateFileDom = function(x_file){
  var $data, file_slug, amount, title, title, $datarow, $del, $title, count, disk_slug
  $data = $('#filerows')
  file_slug = x_file['slug']
  disk_slug = x_file['disk']['slug']
  size = formatBytes(x_file['size'])
  $datarow = $data.find(".row[file_slug="+file_slug+"]")
  
  if($datarow.length){ // If exists, just update amount
    $datarow.find('.amount').html(size)
  }else{ // Else create new dom object
    title = titleFile(x_file)

    if(x_file.glitched)
      title = glitch(title)
    
    type = x_file['type']

    $datarow = $("<div class='row' disk_slug='"+disk_slug+"' file_slug='"+file_slug+"'>"+
                    "<div class='cell title clickable'>"+title+"</div>"+
                    "<div class='cell amount'>"+size+"</div>"+
                    "<div class='cell del'>.</div>"+
                    "<div class='cell mv'>.</div>"+
                  "</div>"+
                  "<div class='clear'></div>")
    $data.append($datarow)

    $datarow.click(function(){
      if(!g_mving_file || g_mving_file['slug'] != file_slug){ return}
      mvFileClick(x_file)
      $(this).find('.mv').html('.')
    })
    $datarow.hover(function(){
      if(!g_mving_file || g_mving_file['slug'] != file_slug){ return}
      $(this).find('.mv').html('▓')
    },function(){
      if(!g_mving_file || g_mving_file['slug'] != file_slug){ return}
      $(this).find('.mv').html('.')
    })

    $mv = $datarow.find('.mv')
    $mv.hover(function(){
      if(g_mving_file && g_mving_file['slug'] == file_slug){ return}
      $(this).html('▓')
    },function(){
      if(g_mving_file && g_mving_file['slug'] == file_slug){ return}
      $(this).html('.')
    })
    $mv.click(function(e){
      mvFileClick(x_file)
      e.stopPropagation()
    })

    $del = $datarow.find('.del')
    $del.hover(function(){
      if(g_mving_file && g_mving_file['slug'] == file_slug){ return}
      $(this).html('▓')
    },function(){
      if(g_mving_file && g_mving_file['slug'] == file_slug){ return}
      $(this).html('.')
    })
    $del.click(function(){
      if(g_mving_file && g_mving_file['slug'] == file_slug){ return}
      rmFile(x_file)
      $datarow.remove()
    })

    $title = $datarow.find('.title')
    $title.click(function(){
      if(g_mving_file && g_mving_file['slug'] == file_slug){ return}
      clickFile(x_file)
    })
  }
  refreshFileListView()
}

// Mv crap
mvFileClick = function(x_file){
  $('#filerows').find('.row').removeClass('clicked')

  var clicked_slug = x_file['slug']
  if(!g_mving_file || g_mving_file['slug'] != clicked_slug){
    // if starting the moving file click
    g_mving_file = x_file
    $('#filerows').find('.row[file_slug='+clicked_slug+']').addClass('clicked')
    refreshMenu()
  }else{
    // if canceling the moving file click
    endMvFile()
  }
}



endMvFile = function(){
  $('#filerows').find('.row').removeClass('clicked')
  g_mving_file = null
  refreshMenu()
  refreshFileListView()
}



wipeFiles = function(){
  $('#fileholder').hide()
  $('#filerows').html("")
}