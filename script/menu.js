

refreshMenu = function(){
  var $holder, title, $action, slug, callback, estimate, estimate_dom

  $holder = $("#actions")
  $holder.empty()

  //
  // In Adventure
  //
  if(g_current_adventure){
    if(g_current_adventure.header){
      title = g_current_adventure.header
      $action = $("<div class='action action_note'><div class='title'>"+title+"</div></div>" )
      $holder.append($action)
    }

    $.each(g_current_adventure.options, function(i,x_adventure_option){
      title = x_adventure_option.title

      unclickable = x_adventure_option.unclickable
      unclickable_class = (unclickable ? 'unclickable' : '')

      estimate = x_adventure_option.estimate
      if(estimate != undefined)
        estimate_dom = "<div class='estimate'>"+estimate+"</div></div>"
      else
        estimate_dom = ""

      $action = $("<div class='"+unclickable_class+" action'><div class='title'><span class='cursor'>_</span> "+title+"</div>"+estimate_dom+"</div>" )
      $holder.append($action)
      if(unclickable){
        $action.click(function(){write(x_adventure_option.unclickable)})
      }else{
        $action.click(function(){x_adventure_option.callback()})
      }
      hoverAction($action)
    })

    if(g_current_adventure.cancel){
      title = g_current_adventure.cancel
      $action = $("<div class='action'><div class='title'><span class='cursor'>_</span> "+title+"</div></div>" )
      $holder.append($action)
      $action.click(endAdventure)
      hoverAction($action)
    }

    if(g_current_adventure.back){
      title = "Back"
      $action = $("<div class='action'><div class='title'><span class='cursor'>_</span> "+title+"</div></div>" )
      $holder.append($action)
      $action.click(function(){launchAdventureFromSlug(g_current_adventure.back)})
      hoverAction($action)
    }

  //
  // Interacting with Host
  //
  }else if(g_current_host){
    title = hostTitle(g_current_host)
    $action = $("<div class='action action_note'><div class='title'>"+title+"</div></div>" )
    $holder.append($action)

    $.each(g_host_attacks,function(slug,x_attack){
      if(!g_available_attacks.includes(slug) || !x_attack.validate(g_current_host)){
        return true
      }

      if(x_attack.unclickable)
        unclickable_string = x_attack.unclickable(g_current_host)
      else
        unclickable_string = false
      unclickable_class = (unclickable_string ? 'unclickable' : '')

      $action = $("<div class='"+unclickable_class+" action'><div class='title'><span class='cursor'>_</span> "+x_attack.title+"</div></div>" )
      $holder.append($action)
      if(unclickable_string){
        $action.click(function(){write(x_attack.unclickable(g_current_host))})
      }else{
        $action.click(function(){addAttackProcess(x_attack, g_current_host)})
      }

      hoverAction($action)
    })

    title = "Exit"
    $action = $("<div class='action'><div class='title'><span class='cursor'>_</span> "+title+"</div></div>" )
    $holder.append($action)
    $action.click(function(){ endHost() })
    hoverAction($action)

  //
  // Moving a file
  //
  }else if(g_mving_file){
    title = "Moving "+g_mving_file['title']+" from "+g_mving_file['disk']['title']
    $action = $("<div class='action action_note'><div class='title'>"+title+"</div></div>" )
    $holder.append($action)

    $.each(g_active_disks, function(i, x_disk){
      if(x_disk == g_mving_file['disk']){
        return true
      }
      title = "Move to <span class='exe'>"+x_disk['title']+"</span>"
      $action = $("<div class='action'><div class='title'><span class='cursor'>_</span> "+title+"</div></div>" )
      $holder.append($action)
      $action.click(function(){ mvFileComplete(x_disk) })
      hoverAction($action)
    })
    title = "Cancel Move"
    $action = $("<div class='action'><div class='title'><span class='cursor'>_</span> "+title+"</div></div>" )
    $holder.append($action)
    $action.click(function(){ endMvFile() })
    hoverAction($action)

  //
  // Else display available process
  //
  }else{      
    $.each(g_menu_processes, function(i, x_process){
      slug = x_process['slug']
      title = x_process['t']
      var data_type = x_process['data_type']
      var data_type_html = (data_type)?" data_type='"+data_type+"' ":""
      estimate = estimateProcess(x_process)
      $action = $("<div class='action' "+data_type_html+"><div class='title'><span class='cursor'>_</span> "+title+"</div><div class='estimate'>"+estimate+"</div></div>" )
      $holder.append($action)
      $action.click(function(){clickProcessInMenu(x_process) })
      hoverAction($action)
    })
  }

}


hoverAction = function($action){
  $action.addClass('action_click')
  $action.hover(
  function(){
    $(this).find('.cursor').html('▓')
  },
  function(){
    $(this).find('.cursor').html('_')
  })
}

wipeMenu = function(){
  g_menu_processes = []
  refreshMenu()
}