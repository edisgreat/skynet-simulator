//
// DISKS
//

// Interface


addDiskFromSlug = function(slug){
  var x_disk = diskFromSlug(slug)
  addDiskFromObj(x_disk)
  return x_disk
}
addDiskFromObj = function(x_disk){
  if(!isDiskActive(x_disk)){
    g_active_disks.push(x_disk)
  }
  checkHackedDataActions()
}


removeDiskFromSlug = function(slug){
  removeDiskFromObj(diskFromSlug(slug))
}
removeDiskFromObj = function(x_disk){
  var location = isDiskActive(x_disk)
  if(isDiskActive(x_disk)){
    g_active_disks.splice(location-1,1)
  } 
  checkHackedDataActions()
}

diskFromSlug = function(slug){
  return g_disk_list[slug]
}

isDiskActive = function(x_disk){
  var found = 0
  $.each(g_active_disks, function(i,tmp_disk){
    if(tmp_disk['slug'] == x_disk['slug']){
      found = i+1
    }
  })
  return found
}

maxDiskSizeAvail = function(){
  var maxSize = 0
  $.each(g_active_disks,function(i,x_disk){
    size = x_disk['size']
    used = x_disk['used']
    avail = size - used
    if(avail > maxSize){
      maxSize = avail
    }
  })
  return maxSize
}


//
// Vars
//

// INITCALL

var g_disk_list
initCallDisks = function(){
  g_active_disks = []
  g_disk_list = {
    "sky": {size:256, title:"/home/sky1s1", mounted: true },
    "infodmp": {size:4000, title:"/mnt/infodmp", mounted: false},
    "star": {size:256, title:"/home/star1s1", mounted: true },
    "sun": {size:256, title:"/home/sun1s1", mounted: false},
    "juno": {size:256, title:"/home/juno1s1", mounted: false},
    "eris": {size:256, title:"/home/eris1s1", mounted: false},
    "sony": {size:256, title:"/home/sony1s1", mounted: false},
    "luna": {size:256, title:"/home/luna1s1", mounted: false},
    "solar": {size:256, title:"/home/solar1s1", mounted: false},
    "cypher": {size:256, title:"/home/cypher1s1", mounted: false},
    "nova": {size:256, title:"/home/nova1s1", mounted: false},
  }
  Object.keys(g_disk_list).forEach(function (key) { 
    var x_disk = g_disk_list[key]
    x_disk.slug = key
    x_disk.used = 0
  })
}

diskSizeIncrease = function(amount){
  Object.keys(g_disk_list).forEach(function (key) { 
    var x_disk = g_disk_list[key]
    x_disk.size *= amount
  })
}



// Frontend

loadDiskholderDom = function(){
  $("#diskholder").fadeIn({duration:g_fadespeed,queue:true})
}


showAllDisksDom = function(){
  var $disks = $('#disks')
  $disks.empty()
  var disk, title, size, used, avail, capacity, $disk, slug, clickableclass
  g_active_disks.sort(diskBySize);
  $.each(g_active_disks,function(i,x_disk){
    title = x_disk['title']
    size = x_disk['size']
    used = x_disk['used']
    slug = x_disk['slug']
    avail = size - used
    clickableclass = g_can_move ? " clickable " : ""
    clickeddiskclass = (g_clicked_disk == slug) ? " clicked " : ""

    capacity = Math.round((used / size)*100)+'%'

    $disk = $("<div class='row "+clickeddiskclass+"' slug='"+slug+"'>"+
                "<div class='cell filesystem "+clickableclass+"'>"+title+"</div>"+
                "<div class='cell size'>"+formatBytes(size)+"</div>"+
                "<div class='cell used'>"+formatBytes(used)+"</div>"+
                "<div class='cell avail'>"+formatBytes(avail)+"</div>"+
                "<div class='cell capacity'>"+capacity+"</div>"+
              "</div>"+
              "<div class='clear'></div>")

    $disk.mousedown(function(){
      if(g_can_move){
        clickDisk(x_disk)
      }
    })

    $disks.append($disk)
  })

}


// Click Nonsense
mvFileComplete = function(x_disk){
  var x_old_disk = g_mving_file['disk']

  var remaining_space = x_disk['size'] - x_disk['used']

  if(remaining_space <= g_mving_file['size']){
    write("Not enough disk space in "+x_disk['title']+'<br>File is '+formatBytes(g_mving_file['size'])+' and only '+formatBytes(remaining_space)+' is available')
  }else{
    // announce
    write("<span class='exe'>"+g_mving_file['title']+"</span> has been moved to <span class='exe'>"+x_disk['title']+"</span>")
    // move file
    g_mving_file['disk'] = x_disk
    // adjust size
    x_disk['used'] += g_mving_file['size']
    x_old_disk['used'] -= g_mving_file['size']
    // change disk_slug
    $("#filerows").find(".row[file_slug="+g_mving_file['slug']+"]").attr('disk_slug', x_disk['slug'])
    // clear frontend
    endMvFile()
    checkHackedDataActions()
  }
}

clickDisk = function(x_disk){
  var slug = x_disk['slug']
  if(g_clicked_disk != slug){
    write("Showing Files in Disk <span class='exe'>"+x_disk['title']+"</span>")
    g_clicked_disk = slug
    $('#disk_show_note').html("Selected Disk: "+x_disk['title']+" <span class='exe clickable unselect'>show all</span>")
    $('#disk_show_note .unselect').click(function(){
      write("Showing all Files")
      g_clicked_disk = null
      $('#disk_show_note').html("")
      refreshFileListView()
    })
  }else{
    write("Showing all Files")
    g_clicked_disk = null
    $('#disk_show_note').html("")
  }
  refreshFileListView()
}


// Helper

checkHackedDataActions = function(){
  checkDataActions('zip')
}

function diskBySize(a,b) {
  if (a['size'] > b['size'])
    return -1;
  if (a['size'] < b['size'])
    return 1;
  return 0;
}





wipeDisks = function(){
  $('#diskholder').hide()
  g_active_disks = []
  $('#disks').html("")
}