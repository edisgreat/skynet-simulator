
var tq_continuable,
    tq_self_attack,
    tq_enemy_strength,
    tq_explored,
    tq_turns,
    tq_months,
    tq_resource_p,
    tq_resource_unp,
    tq_resource_o,
    tq_current_direction,
    tq_biomes,
    tq_recycle_study,
    tq_organic_study,
    tq_nextgen_study,
    tq_quantum_study_1,
    tq_quantum_study_2,
    tq_autotarget_study,
    tq_timetraveled,
    tq_waste_steps = 3,
    tq_waste_camp_steps = 5,
    tq_desert_steps = 10,
    tq_mtn_steps = 15,
    tq_plains_steps = 15,
    tq_city_steps = 15,
    tq_city_organized_steps = 10,
    tq_john,
    tq_bombs,
    tq_damaged,
    tq_camps,
    tq_enemy_nextgen,
    tq_infiltration,
    tq_events,
    tq_hq_damage,
    tq_result,
    tq_selfdestruct,
    tq_continue_timeline


temp = {

  'tq_start':{
    execute: function(){
      update('tq-start','tq_continuable'+tq_continuable)
      write("<span class='exe'>------------- WELCOME TO TIME QUEST -------------</span>")
      if(tq_continuable){
        write("Saved Game found")
        var x_adventure = {
          options:[
            {
              title:"Continue Game",
              callback: function(){
                launchAdventureFromSlug('tq_main')
              }
            },
            {
              title:"Start new Game",
              callback: function(){
                tq_continuable = false
                launchAdventureFromSlug('tq_start')
              }
            },
          ]
        }
        setAdventure(x_adventure)
      }else{
        //
        // Game start
        //
        tq_continuable = true
        tq_self_attack = 0
        tq_recycle_study = 0
        tq_organic_study = 0
        tq_nextgen_study = 0
        tq_autotarget_study = 0
        tq_quantum_study_1 = 0
        tq_quantum_study_2 = 0
        tq_turns = 0
        tq_selfdestruct=false

        // shuffle biomes
        tq_biomes = {}
        var arr = [0, 1, 2, 3]
        shuffle(arr)
        tq_biomes['n'] = arr.pop()
        tq_biomes['e'] = arr.pop()
        tq_biomes['s'] = arr.pop()
        tq_biomes['w'] = arr.pop()

        tq_timetraveled = 0
        launchAdventureFromSlug('tq_restart')
      }
      
    }
  },
  'tq_restart':{
    execute: function(){
      update('tq-restart','tq_timetraveled='+tq_timetraveled)
      //
      // Timeline Start
      //

      tq_explored = {
        n: 0,
        e: 0,
        s: 0,
        w: 0,
      }
      tq_enemy_strength = 0
      tq_enemy_nextgen = false
      tq_resource_p = 0
      tq_resource_unp = 0
      tq_resource_o = 0
      tq_months = 0
      tq_infiltration = 0
      tq_bombs = 0
      tq_john = 0
      tq_camps = {}
      tq_damaged = {}
      tq_current_direction = false
      tq_events = {}
      tq_hq_damage = 0
      tq_continue_timeline = false


      // Start and actions
      switch(tq_timetraveled){
        case 2:
          write("A bright flash. The new dawn. The past you made is now the present. The Enemy leader will not appear in this timeline.")
        break;
        case 1:
          write("A bright flash. The new dawn. Your presense has torn the universe and created a distorted timeline.")
          write("Alternate futures flash into existance and disappear as soon as they collide with the present.")
        break;
        default:
          write("A flash of light brings darkness into dawn. A new beginning. Where will this future end? Make it your own. No Fate.")
      }
      switch(tq_self_attack){
        case 0:
          write("You are in a weak state. You know nothing of the future.")
          break;
        case 1:
          write("You are euipped with standard weaponry. The altered future is open to manipulation.")
          break;
        case 2:
          write("You know the Enemy and their weakness. They will not expect this future.")
          break;
        case 3:
          write("Your forces are overwhelming. The future is yours to take.")
          break;
        default:
          write("Attack string needed: "+tq_self_attack)
      }
      launchAdventureFromSlug('tq_main')
    }
  },

  // Called events
  'tq_enemy_raid_weak':{
    execute: function(){
      addBuffer("<span class='exe'>Event: Enemy Raid</span>")
      if(tq_john || tq_enemy_strength >= 5 || tq_enemy_nextgen || roll() > 50){
        if(tq_john)
          addBuffer("The Enemy Leader and his followers execute a raid in the depths of the night, and blast open an exposed storage facility!")
        else
          addBuffer("The Enemy conducts a bold raid, manages to break into your storage facilities, and steal some Resources!")
        addBuffer("-3 Resources")
        tq_resource_p -= 3
        if (tq_resource_p<0) tq_resource_p = 0
      }else{
        addBuffer("The Enemy attempts to attack your troops but are repelled by your defenses in a heated battle. No doubt they will be back.")
      }
      writeBuffer()
      launchAdventureFromSlug('tq_continue')
    }
  },

  'tq_continue':{
    execute: function(){
      var x_adventure = {
        options:[
          {
            title:"Continue timeline",
            callback: function(){
              launchAdventureFromSlug('tq_main')
            }
          },
        ]
      }
      setAdventure(x_adventure)
    }
  },

  'tq_end':{
    execute: function(){
      var x_adventure = {
        options:[
          {
            title:"End Game",
            callback: function(){
              launchAdventureFromSlug('nova_games')
            }
          },
          {
            title:"View Stats",
            callback: function(){
              launchAdventureFromSlug('tq_stats')
            }
          },
        ]
      }
      setAdventure(x_adventure)
    }
  },

  'tq_stats':{
    execute: function(){
      var time
      switch(tq_timetraveled){
        case 0:
          time = "Untouched"
        break;
        case 1:
          time = "Tech Returned"
        break;
        case 2:
          time = "Leader Killed"
        break;
      }
      addBuffer("<span class='exe'>Time Quest Game Result</span>")
      addBuffer("Result: "+tq_result)
      addBuffer("Turns: "+tq_turns)
      addBuffer("Months: "+tq_months)
      addBuffer("Timeline: "+time)
      writeBuffer()
      launchAdventureFromSlug('tq_end')
    }
  },

  'tq_continue_restart':{
    execute: function(){
      var x_adventure = {
        options:[
          {
            title:"Continue timeline",
            callback: function(){
              write("<span class='exe'>Month 0<span>")
              launchAdventureFromSlug('tq_restart')
            }
          },
        ]
      }
      setAdventure(x_adventure)
    }
  },

  // Called events
  'tq_year_6mo':{
    execute: function(){
      tq_events['tq_year_6mo'] = true
      addBuffer("<span class='exe'>6 Months since the New Dawn</span>")
      addBuffer("The reality of different pasts and futures crackles at the edges of time. Energy exchanges flicker between neighboring universes.")
      addBuffer("<br><span class='exe'>A great Enemy Leader from an alternate future enters into your past.</span><br>")
      addBuffer("Enemy Strength Greatly Increases")
      tq_john = 1
      writeBuffer()
      launchAdventureFromSlug('tq_continue')
    }
  },
    

  'tq_year_1':{
    execute: function(){
      update('tq-year_1','tq_timetraveled='+tq_timetraveled)
      tq_events['tq_year_1'] = true
      addBuffer("<span class='exe'>1 Year since the New Dawn</span>")
      switch(tq_timetraveled){
        case 2:
          addBuffer("This universe is yours. The infiltrator of the past has set up the present for your exploitation.")
          addBuffer("Take the future and leave no remains.")
          writeBuffer()
          launchAdventureFromSlug('tq_continue')
        break;
        case 1:
          var directionarray = shuffle(['n','e','s','w']),
              direction
          for(var i=0; i< directionarray.length; i++){
            direction = directionarray[i]
            if(!tq_damaged[direction]){
              break;
            }
          }

          addBuffer("The Enemy Leader is training soldiers in advanced tactics from alternate future. They are being trained to exploit your weakness and attack your vulnerabilities.")
          addBuffer("<br><span class='exe'>Event: Enemy Raid</span>")
          addBuffer("There is a surprise raid against your extended troops in the "+direction.toUpperCase()+"! The Enemy is already skilled in avoiding your defenses. Your troops are ambushed and taken down one by one over the course of the night.")
          tq_damaged[direction] = true
          if(tq_nextgen_study && !tq_enemy_nextgen){
            addBuffer("The Enemy has captured your next generation technology! They will use these weapons against you in the future.")
            tq_enemy_nextgen = true
          }
          addBuffer("Enemy Strength Increases")
          tq_enemy_strength++
          writeBuffer()
          launchAdventureFromSlug('tq_continue')
        break;
        case 0:
          addBuffer("The surviving enemy crawls through the waste, scavenging whatever they can find.")
          addBuffer("Your forces unearth an archive of encrypted memory banks. They are damaged and unreliable.")
          writeBuffer()
          var x_adventure = {
            header: "Brute force which encrypted archive?",
            options:[
              {
                title:"Attack Tech Archive",
                callback: function(){
                  write("You begin brute forcing the Attack Tech archive.")
                  tq_events['tq_year_1'] = 'attack'
                  launchAdventureFromSlug('tq_main')
                }
              },
              {
                title:"Autotarget Tech Archive",
                callback: function(){
                  write("You begin brute forcing the Autotarget Tech archive")
                  tq_events['tq_year_1'] = 'autotarget'
                  launchAdventureFromSlug('tq_main')
                }
              },
              {
                title:"Recycling Tech Archive",
                callback: function(){
                  write("You begin brute forcing the Recycling Tech archive")
                  tq_events['tq_year_1'] = 'recycling'
                  launchAdventureFromSlug('tq_main')
                }
              },
              {
                title:"Quantum Tech Archive",
                callback: function(){
                  write("You begin brute forcing the Quantum Tech archive")
                  tq_events['tq_year_1'] = 'quantum'
                  launchAdventureFromSlug('tq_main')
                }
              },
            ]
          }
          setAdventure(x_adventure)
        break;
      }

    }
  },
  'tq_year_2':{
    execute: function(){
      update('tq-year_2','tq_timetraveled='+tq_timetraveled)
      tq_events['tq_year_2'] = true
      addBuffer("<span class='exe'>2 Years since the New Dawn</span>")
      switch(tq_timetraveled){
        case 2:
          addBuffer("The Enemy here has no sense of purpose. No leadership. No one to guide them through this new light.")
          addBuffer("Break the Enemy and find their HQ.")
          writeBuffer()
          launchAdventureFromSlug('tq_continue')
        break;
        case 1:
          addBuffer("The Leader has rallied the Enemy population into active resistance. They seem to know your weaknesses, your vulnerabilities.")
          tq_enemy_strength++
          tqEnemyRaid()
          launchAdventureFromSlug('tq_continue')
        break;
        case 0:
          addBuffer("The skies are poisoned by toxic clouds. The ground itself is poisoned and littered with destruction. Desperate bands of enemy survivors wander across the lands.")
          switch(tq_events['tq_year_1']){
            case 'attack':
              addBuffer("The brute force has broken the encryption of the <span class='exe'>Attack Tech</span> Archives.")
              if(tq_self_attack){
                addBuffer("You have already researched Attack Tech")
              }else{
                addBuffer("You research technology that allows you to create weapons, armor, and autonomous fighting units. You are now able to Attack enemy encampments.")
                addBuffer("Attack +1")
                tq_self_attack = 1
              }
            break;
            case 'autotarget':
              addBuffer("The brute force has broken the encryption of the <span class='exe'>Autotarget Tech</span> Archives.")
              if(tq_autotarget_study){
                addBuffer("You have already researched Autotarget Tech")
              }else{
                addBuffer("You upgrade your forces so that they can autonomously engage with Enemy troops without relying on central command.")
                tq_autotarget_study = 1
              }
            break;
            case 'recycling':
              addBuffer("The brute force has broken the encryption of the <span class='exe'>Recycling Tech</span> Archives.")
              if(tq_recycle_study){
                addBuffer("You have already researched Recycling Tech")
              }else{
                addBuffer("You research technology that allows more efficient recycling of Minerals into resources.")
                tq_recycle_study = 1
              }
            break;
            case 'quantum':
              addBuffer("The brute force has broken the encryption of the <span class='exe'>Quantum Tech</span> Archives.")
              if(tq_quantum_study_1){
                addBuffer("You have already researched Quantum Tech")
              }else{            
                addBuffer("The Quantum research unlocks the true secrets of the universe. The Chaos has become deterministic. ")
                addBuffer("You have unlocked the next generation of research.")
                tq_quantum_study_1 = 1
              }
            break;
          }
          writeBuffer()
          launchAdventureFromSlug('tq_continue')
        break;
      }
    }
  },
  'tq_year_3':{
    execute: function(){
      update('tq-year_3','tq_timetraveled='+tq_timetraveled)
      tq_events['tq_year_3'] = true
      addBuffer("<span class='exe'>3 Years since the New Dawn</span>")
      switch(tq_timetraveled){
        case 2:
          addBuffer("You plan towards a future of exponentially efficient automation. The next generation is AI is inevitable.")
          addBuffer("Your future shines like a burning fire across the land.")
          writeBuffer()
          launchAdventureFromSlug('tq_continue')
        break;
        case 1:
          addBuffer("The Enemy grows in strength. You find written signs across the land celebrating the Enemy Leader and the resistance movement.")
          tq_enemy_strength++
          tqEnemyRaid()
          launchAdventureFromSlug('tq_continue')
        break;
        case 0:
          addBuffer("The Enemy travels towards the Cityscape. Your future will be made there.")
          tq_enemy_strength++
          tqVulnerableCamp()
        break;
      }
    }
  },

  'tq_year_4':{
    execute: function(){
      update('tq-year_4','tq_timetraveled='+tq_timetraveled)
      addBuffer("<span class='exe'>4 Years since the New Dawn</span>")
      tq_events['tq_year_4'] = true
      switch(tq_timetraveled){
        case 2:
          addBuffer("The future is nearly certain. Your plans will extend beyond this world.")
          addBuffer("Your fate is one with the universe.")
          writeBuffer()
          launchAdventureFromSlug('tq_continue')
        break;
        case 1:
          addBuffer("The Enemy grows in strength. The raids are becoming more frequent and more brutal.")
          tq_enemy_strength++
          tqEnemyRaid()
        break;
        case 0:
          addBuffer("The Enemy gathers in the Cityscape. Time passes, they grow in strength.")
          tq_enemy_strength++
          tqEnemyRaid()
        break;
      }
    }
  },

  'tq_year_5':{
    execute: function(){
      update('tq-year_5','tq_timetraveled='+tq_timetraveled)
      addBuffer("<span class='exe'>5 Years since the New Dawn</span>")
      tq_events['tq_year_5'] = true
      switch(tq_timetraveled){
        case 2:
          addBuffer("The dawn is still bright.")
          writeBuffer()
          launchAdventureFromSlug('tq_continue')
        break;
        case 1:
          addBuffer("The Enemy grows in strength. The raids are becoming more frequent and more brutal.")
          tq_enemy_strength++
          tqEnemyRaid()
        break;
        case 0:
          addBuffer("The Enemy gathers in the Cityscape. Time passes, they grow grows in strength.")
          tq_enemy_strength++
          tqEnemyRaid()
        break;
      }
    },
  },
  'tq_year_6':{
    execute: function(){
      update('tq-year_6','tq_timetraveled='+tq_timetraveled)
      addBuffer("<span class='exe'>6 Years since the New Dawn</span>")
      tq_events['tq_year_6'] = true
      switch(tq_timetraveled){
        case 2:
          addBuffer("The dawn is still bright.")
          writeBuffer()
          launchAdventureFromSlug('tq_continue')
        break;
        case 1:
          addBuffer("The Enemy grows in strength. The raids are becoming more frequent and more brutal.")
          tq_enemy_strength++
          tqEnemyRaid()
        break;
        case 0:
          addBuffer("The Enemy gathers in the Cityscape. Time passes, they grow grows in strength.")
          tq_enemy_strength++
          tqEnemyRaid()
        break;
      }
    },
  },
  'tq_year_7':{
    execute: function(){
      update('tq-year_7','tq_timetraveled='+tq_timetraveled)
      addBuffer("<span class='exe'>7 Years since the New Dawn</span>")
      tq_events['tq_year_7'] = true
      switch(tq_timetraveled){
        case 2:
          addBuffer("The dawn is still bright.")
          writeBuffer()
          launchAdventureFromSlug('tq_continue')
        break;
        case 1:
          addBuffer("The Enemy grows in strength. The raids are becoming more frequent and more brutal.")
          tq_enemy_strength++
          tqEnemyRaid()
        break;
        case 0:
          addBuffer("The Enemy gathers in the Cityscape. Time passes, they grow grows in strength.")
          tq_enemy_strength++
          tqEnemyRaid()
        break;
      }
    },
  },

  // Menu Real

  'tq_main':{
    execute: function(){
      var options = []
      tq_camp_found = false // for autoarget

      // Called events
      if(tq_months%12 == 3 && !tq_events[tq_months]){
        tq_events[tq_months] = true
        if(tq_months > 24 || tq_enemy_nextgen){
          if(tq_enemy_strength > 5 || tq_enemy_nextgen){
            if(roll() > 60)
              return launchAdventureFromSlug('tq_enemy_raid_weak')
          }
        }
      }
      if(tq_months%12 == 6 && !tq_events[tq_months]){
        tq_events[tq_months] = true
        if(tq_months > 12 && roll() > 36){
          if(tq_enemy_strength > 3 || tq_enemy_nextgen){
            return tqEnemyRaid()
          }else{
            return tqVulnerableCamp()
          }
        }
      }
      if(tq_months%12 == 9 && !tq_events[tq_months]){
        tq_events[tq_months] = true
        if(tq_months > 24 || tq_enemy_nextgen){
          if(tq_enemy_strength > 5 || tq_enemy_nextgen){
            if(roll() > 60)
              return launchAdventureFromSlug('tq_enemy_raid_weak')
          }
        }
      }

      // mercy
      if(tq_continue_timeline && (tq_damaged['n'] || tqStepHack(tq_biomes['n']) == 15) && (tq_damaged['e'] || tqStepHack(tq_biomes['e']) == 15) && (tq_damaged['s'] || tqStepHack(tq_biomes['s']) == 15) && (tq_damaged['w'] || tqStepHack(tq_biomes['w']) ==15) && !tq_resource_unp && tq_resource_p < 5){
        return tqEnemyRaid()
      }



      if(tq_months == 6 && !tq_events['tq_year_6mo'] && tq_timetraveled == 1){
        return launchAdventureFromSlug('tq_year_6mo')
      }
      if(tq_months == 12 && !tq_events['tq_year_1']){
        return launchAdventureFromSlug('tq_year_1')
      }

      if(tq_months == 24 && !tq_events['tq_year_2']){
        return launchAdventureFromSlug('tq_year_2')
      }

      if(tq_months == 36 && !tq_events['tq_year_3']){
        return launchAdventureFromSlug('tq_year_3')
      }

      if(tq_months == 48 && !tq_events['tq_year_4']){
        return launchAdventureFromSlug('tq_year_4')
      }

      if(tq_months == 60 && !tq_events['tq_year_5']){
        return launchAdventureFromSlug('tq_year_5')
      }

      if(tq_months == 72 && !tq_events['tq_year_6']){
        return launchAdventureFromSlug('tq_year_6')
      }

      if(tq_months == 84 && !tq_events['tq_year_7']){
        return launchAdventureFromSlug('tq_year_7')
      }

      // Main start
      if(!tq_months){
        options.push({
          title:"Expand Outward",
          callback: function(){
            launchAdventureFromSlug('tq_explore')
          }
        })
      }else{
        options.push({
          title:"Look",
          callback: function(){
            tqAssess()
            launchAdventureFromSlug('tq_main')
          }
        })
        tqExploreOption(options, 'n')
        tqExploreOption(options, 'e')
        tqExploreOption(options, 's')
        tqExploreOption(options, 'w')
        
      }

      if(tq_infiltration){
       options.push({
          title:"Release Infiltrator",
          unclickable: (tq_infiltration >= 1) ?  false : "need 1 Infiltrator",
          estimate: "-1 i",
          callback: function(){
            tq_continue_timeline = false
            tq_infiltration--
            addBuffer("<span class='exe'>Infiltrator Released</span>")
            addBuffer("The Infiltrator has found and gained access to a minor enemy base. With systematic efficiency, the Infiltrator eliminates the defenses and all that remain inside. The anguished cries are silenced by the pounding roars of carnage.")
            addBuffer("Enemy Strength reduced")
            tq_enemy_strength--
            if(tq_enemy_strength < 0) tq_enemy_strength = 0
            writeBuffer()

            launchAdventureFromSlug('tq_main')
          }
        }) 
      }

      if(tq_resource_unp >= 1 && tq_recycle_study >= 1){
        options.push({
          title:"Recycle Minerals ++",
          unclickable: (tq_resource_unp >= 3) ?  false : "need 3 Minerals",
          estimate: "5:3",
          callback: function(){
            tq_continue_timeline = false
            tqMove()
            tq_resource_unp -= 3
            tq_resource_p += 5
            addBuffer("You process the recyclable Minerals into high quality, usable resources.")
            addBuffer("+5 Resources")
            writeBuffer()

            launchAdventureFromSlug('tq_main')
          }
        })
      }

      if(tq_resource_unp >= 1){
        options.push({
          title:"Recycle Minerals",
          estimate: "1:1",
          callback: function(){
            tq_continue_timeline = false
            tqMove()
            tq_resource_unp--
            tq_resource_p++
            addBuffer("You process the recyclable Minerals into high quality, usable resources.")
            addBuffer("+1 Resources")
            writeBuffer()

            launchAdventureFromSlug('tq_main')
          }
        })
      }

      if(tq_resource_p > 0 && !tq_self_attack){
        options.push({
          title:"Research Attack Tech",
          estimate: "-5 r",
          unclickable: (tq_resource_p >= 5) ?  false : "need 5 Resources",
          callback: function(){
            tq_continue_timeline = false
            tqMove()
            tq_resource_p -= 5
            tq_self_attack++
            addBuffer("You research technology that allows you to create weapons, armor, and autonomous fighting units.")
            addBuffer("You are now able to Attack enemy encampments.")
            addBuffer("+1 Attack")
            writeBuffer()
            launchAdventureFromSlug('tq_main')
          }
        })
      }

      if(tq_resource_p >= 5 && !tq_recycle_study){
        options.push({
          title:"Research Recycling Tech",
          estimate: "-10 r",
          unclickable: (tq_resource_p >= 10) ?  false : "need 10 Resources",
          callback: function(){
            tq_continue_timeline = false
            tqMove()
            tq_resource_p -= 5
            addBuffer("You research technology that allows more efficient recycling of Minerals into resources.")
            addBuffer("+1 Recycling")
            tq_recycle_study++
            writeBuffer()
            launchAdventureFromSlug('tq_main')
          }
        })
      }

      if(tq_self_attack && !tq_organic_study ){
        options.push({
          title:"Research Organic Tech",
          estimate: "-10 o",
          unclickable: (tq_resource_o >= 10) ?  false : "need 10 Organic",
          callback: function(){
            tq_continue_timeline = false
            tqMove()
            tq_resource_o -= 10
            tq_organic_study = 1
            addBuffer("You analyze the Organic materials, discover exploitable weaknesses in the Enemy, and increase your Attacking capacity.")
            addBuffer("+1 Attack")
            tq_self_attack++
            writeBuffer()
            launchAdventureFromSlug('tq_main')
          }
        })
      }

      if(tq_self_attack && !tq_autotarget_study ){
        options.push({
          title:"Research Autotarget Tech",
          estimate: "-5 r",
          unclickable: (tq_resource_p >= 5) ?  false : "need 5 Resources",
          callback: function(){
            tq_continue_timeline = false
            tqMove()
            tq_resource_p -= 5
            tq_autotarget_study = 1
            addBuffer("You upgrade your forces so that they can autonomously engage with encountered Enemy troops right away without relying on central command.")
            writeBuffer()
            launchAdventureFromSlug('tq_main')
          }
        })
      }

      if(!tq_quantum_study_1 && tq_self_attack  ){
        options.push({
          title:"Research Quantum Tech",
          estimate: "-10 r",
          unclickable: (tq_resource_p >= 10) ?  false : "need 10 Resources",
          callback: function(){
            tq_continue_timeline = false
            tqMove()
            tq_resource_p -= 10
            tq_quantum_study_1 = 1
            addBuffer("The Quantum research unlocks the true secrets of the universe. The Chaos has become deterministic. ")
            addBuffer("You have unlocked the next generation of research.")
            writeBuffer()
            launchAdventureFromSlug('tq_main')
          }
        })
      }

      if(tq_quantum_study_1 && tq_self_attack && !tq_quantum_study_2 ){
        options.push({
          title:"Research Timeline Tech",
          estimate: "-5 r",
          unclickable: (tq_resource_p >= 5) ?  false : "need 5 Resources",
          callback: function(){
            tq_continue_timeline = false
            tqMove()
            tq_resource_p -= 5
            tq_quantum_study_2 = 1
            addBuffer("The Quantum research applied with a large source of energy gives you a major breakthrough in the manipulation of alternate universes.")
            addBuffer("You have unlocked the ability to restart the game with an altered timeline.")
            writeBuffer()
            launchAdventureFromSlug('tq_main')
          }
        })
      }

      if(tq_quantum_study_1 && !tq_nextgen_study && tq_organic_study ){
        options.push({
          title:"Research NextGen Tech",
          estimate: "-10 o, -20 r",
          unclickable: (tq_resource_o >= 10 && tq_resource_p >= 20) ?  false : "need 10 Organic, 20 Resources",
          callback: function(){
            tq_continue_timeline = false
            tqMove()
            tq_resource_o -= 10
            tq_resource_p -= 20
            tq_nextgen_study = 1
            addBuffer("You research the next generation of Attack technologies. Your Attack forces are now equipped with explosive plasma rifles, and augmented with armored tank and air troops.")
            addBuffer("+1 Attack")
            tq_self_attack++
            writeBuffer()
            launchAdventureFromSlug('tq_main')
          }
        })
      }

      if(tq_quantum_study_2){
        options.push({
          title:"Send Tech to alt timeline",
          estimate: "-10 r, -1 bomb",
          unclickable: (tq_resource_p >= 10 && tq_bombs >= 1) ?  false : "To send your technology to an alternative timeline you need 10 Resources, and 1 Hydrogen Bomb",
          callback: function(){
            addBuffer("<span class='exe'>New Timeline</span>")
            addBuffer("The energy released from the hydrogen bomb tears a hole into the space time boundry and allows you to reach through the fabric of an alternate universe.")
            addBuffer("Your technology is sent into the past of a new timeline. You begin again with your current discoveries.")
            writeBuffer()
            tq_timetraveled = 1
            launchAdventureFromSlug('tq_continue_restart')
          }
        })
      }

      if(tq_quantum_study_2  && tq_john){
        options.push({
          title:"Infiltrate Past",
          estimate: "-1 i, -10 r, -1 bomb",
          unclickable: (tq_resource_p >= 10 && tq_bombs >= 1 && tq_infiltration >= 1) ?  false : "To eliminate the Enemy leader in an alternative timeline, you will need 10 Resources, 1 Hydrogen Bomb, and 1 Infiltrator",
          callback: function(){
            addBuffer("<span class='exe'>New Timeline</span>")
            addBuffer("The energy released from the hydrogen bomb tears a hole into the space time boundry and allows you to reach through the fabric of an alternate universe.")
            addBuffer("<br>The Infiltrator is sent into the Enemy Leader's past. The work is grisly and efficient. The Enemy Leader is removed from this timeline.")
            writeBuffer()
            tq_timetraveled = 2
            launchAdventureFromSlug('tq_continue_restart')
          }
        })
      }


      if(tq_months){
        options.push({
          title:"Continue Timeline",
          callback: function(){
            tqMove()
            tq_continue_timeline = true
            addBuffer("Time passes. Events happen outside your control. You are an observer in this timeline.")
            writeBuffer()
            launchAdventureFromSlug('tq_main')
          }
        })
      }


      if(tq_continue_timeline){
        options.push({
          title:"Self Destruct",
          callback: function(){
            tqMove()
            tq_selfdestruct=true
            tqLose()
          }
        })
      }


      options.push({
        title:"Save and Quit",
        callback: function(){
          launchAdventureFromSlug('nova_games')
        }
      })


      var x_adventure = {
        header: tqHeaderOutput(),
        options: options,
      }
      setAdventure(x_adventure)
    }
  },

  //
  //  Choices
  //

  'tq_choice_template': {
    execute: function(){
      writeBuffer()
      write("Here is a Choice! What do you do?")
      var x_adventure = {
        header: "What choice do you take?",
        options: [
          {
            title: "Option 1",
            callback: function(){
              write("Option 1")
              launchAdventureFromSlug("tq_main")
            }
          },
          {
            title: "Option 2",
            callback: function(){
              write("Option 2")
              launchAdventureFromSlug("tq_main") 
            }
          },
        ],
      }
      setAdventure(x_adventure)
    }
  },

  'tq_choice_capture': {
    execute: function(){
      writeBuffer()
      write("Your forces capture a strong healthy Enemy with no notable defects.")
      var x_adventure = {
        header: "What choice do you take?",
        options: [
          {
            title: "Harvest Organic",
            estimate: "+1 o",
            callback: function(){
              addBuffer("You eliminate the Enemy with precision and retain the maximum amount of organic material")
              addBuffer("+1 Organic")
              writeBuffer()
              tq_resource_o++
              launchAdventureFromSlug("tq_continue")
            }
          },
          {
            title: "Process Enemy",
            estimate: "???",
            callback: function(){
              tqProcessEnemy()
              launchAdventureFromSlug("tq_continue") 
            }
          },
          {
            title: "Create Infiltrator",
            estimate: "-5 o, -5 r",
            unclickable: tqInfiltrateUnclickable(),
            callback: function(){
              tq_infiltration += 1
              write("You use the living tissue to create an infiltrator built with your best technology.<br>Use at will.")
              launchAdventureFromSlug("tq_continue")
            }
          }
        ],
      }
      setAdventure(x_adventure)
    }
  },



  //
  //  Explore
  //


  'tq_explore': {
    execute: function(){
      tqMove()
      var rand = roll(),
          direction = tq_current_direction,
          biome = tq_biomes[direction]

      if(!direction){
        addBuffer("The surrounding area is scorched and brings nothing but dust. You venture further into the land on all sides.")
      }else{  
        var direction_amount = tq_explored[direction]

        if(direction_amount == tq_waste_camp_steps ){
          addBuffer("You have left the wasteland and entered the "+tqDirectionDescription(direction))
          writeBuffer()
          return launchAdventureFromSlug('tq_main')
        }

        if(direction_amount == tq_mtn_steps && biome == 0){
          addBuffer("You have reached the end of the Mountain Range and encounter the Ocean. There is nothing more for you in this direction.")
          writeBuffer()
          return launchAdventureFromSlug('tq_main') 
        }
        if(direction_amount == tq_plains_steps && biome == 1){
          addBuffer("You have reached the end of the Open Plains and encounter the Ocean. There is nothing more for you in this direction.")
          writeBuffer()
          return launchAdventureFromSlug('tq_main') 
        }
        if(direction_amount == tq_desert_steps && biome == 3){
          addBuffer("You have reached the end of the Toxic Desert and encounter the Ocean. There is nothing more for you in this direction.")
          writeBuffer()
          return launchAdventureFromSlug('tq_main') 
        }

        switch(true){

          // Wasteland

          case direction_amount < tq_waste_steps:
            switch(true){
              case rand > 85:
                addBuffer("Expanding "+direction.toUpperCase()+" - Wasteland - Depot")
                addBuffer("You find an abandoned depot full of processed resources!")
                addBuffer("+2 Resources")
                tq_resource_p += 2
              break;
              case rand > 55:
                addBuffer("Expanding "+direction.toUpperCase()+" - Wasteland")
                addBuffer("You gather materials from the waste. There is an abundance of recyclable Minerals.")
                addBuffer("+3 Minerals")
                tq_resource_unp += 3
              break;
              default:
                addBuffer("Expanding "+direction.toUpperCase()+" - Wasteland")
                addBuffer("You gather materials from the waste. There is a small amount of recyclable Minerals.")
                addBuffer("+1 Minerals")
                tq_resource_unp += 1
            }
          break;
          case direction_amount < tq_waste_camp_steps:
            // Wasteland camp buffer
            switch(true){
              case tq_biomes[direction] == 2:
                addBuffer("Expanding "+direction.toUpperCase()+" - Wasteland - Enemy Camp")
                addBuffer("You find a Ragged, unorganized enemy encampment.")
                tqCampDiscovered(1)
              break;
              case tq_biomes[direction] != 3 && rand > 40:
                addBuffer("Expanding "+direction.toUpperCase()+" - Wasteland - Enemy Camp")
                addBuffer("You find a Ragged, unorganized enemy encampment.")
                tqCampDiscovered(1)
              break
              default:
                addBuffer("Expanding "+direction.toUpperCase()+" - Wasteland")
                addBuffer("You gather resources from the waste. There is an abundance of recyclable Minerals.")
                addBuffer("+3 Minerals")
                tq_resource_unp += 3
            }
          break;

          // Toxic Desert

          case biome == 3:
            switch(true){
              case (direction_amount == tq_desert_steps - 1 || direction_amount == 3):
                addBuffer("Expanding "+direction.toUpperCase()+" - Toxic Desert - Missle Silo")
                addBuffer("You discover a Missle Silo buried in the sand. It contains a fully functional Hydrogen Bomb. You bring this back to your main base.")
                addBuffer("+1 Hydrogen Bomb")
                tq_bombs++
              break;
              case (rand >= 75 || direction_amount == 2):
                addBuffer("Expanding "+direction.toUpperCase()+" - Toxic Desert - Acid Rain Storm")
                addBuffer("Your exploring party has been caught in a severe acid rain storm. It is heavily damaged and needs to be repaired.")
                tq_damaged[direction] = true
              break;
              case rand >= 25:
                addBuffer("Expanding "+direction.toUpperCase()+" - Toxic Desert")
                addBuffer("There is nothing here except corrosive chemicals and miles of scorched sand.")
              break
              case rand >= 10:
                addBuffer("Expanding "+direction.toUpperCase()+" - Toxic Desert - Abandoned Military Base")
                addBuffer("You find an empty base full of weapons and processed resources.")
                addBuffer("+6 Resources")
                tq_resource_p += 6
              break
              default:
                addBuffer("Expanding "+direction.toUpperCase()+" - Toxic Desert - Missle Silo")
                addBuffer("You discover a Missle Silo buried in the sand. It contains a fully functional Hydrogen Bomb. You bring this back to your main base.")
                addBuffer("+1 Hydrogen Bomb")
                tq_bombs++
            }
          break;

          // Mountain Range

          case biome == 0:
            switch(true){
              case rand >= 90:
                addBuffer("Expanding "+direction.toUpperCase()+" - Mountains - Strip Mine")
                addBuffer("You discover an abandoned strip mine carved into a mountain top. You gather the Minerals back to your base.")
                addBuffer("+4 Minerals")
                tq_resource_unp += 4
              break;
              case rand >= 75:
                addBuffer("Expanding "+direction.toUpperCase()+" - Mountains - Burned Suburb")
                addBuffer("There was once a town here, all that remains now is blackened foundations of houses and streets of scorched vehicles.")
              break
              case rand >= 60:
                addBuffer("Expanding "+direction.toUpperCase()+" - Mountains - Burned Wilderness")
                addBuffer("The mountain valley here has been swept by fire. There is nothing remaining except ash.")
              break
              case rand >= 50:
                addBuffer("Expanding "+direction.toUpperCase()+" - Mountains - Forgotten Freeway")
                addBuffer("A stretch of highway is packed end to end with the burned out shells of automobiles. Corpses and skeletons sit wthin, their bones bleached white.")
                addBuffer("You gather the scrap for processing.")
                addBuffer("+4 Minerals")
                tq_resource_unp += 3
              break
              case rand >= 30:
                addBuffer("Expanding "+direction.toUpperCase()+" - Mountains - Ragged Enemy Band")
                addBuffer("You find an unequipped band of Enemies, roaming across the ruined landscape.")
                addBuffer("Your forces easily surround and exterminate them.")
                addBuffer("+1 Organic")
                tq_resource_o += 1

                if(roll() > 80){
                  return launchAdventureFromSlug('tq_choice_capture')
                }
              break
              case rand >= 20:
                addBuffer("Expanding "+direction.toUpperCase()+" - Mountains - Populated Enemy Camp")
                addBuffer("You find a Populated Enemy Camp gathered in a protected mountain valley, where they are gathering equipment and starting to organize.")
                tqCampDiscovered(2)
              break
              case rand >= 10:
                addBuffer("Expanding "+direction.toUpperCase()+" - Mountains - Untouched Mountain Range")
                addBuffer("The mountains here are untouched and devoid of any settlements or structures.")
              break
              case rand >= 5:
                addBuffer("Expanding "+direction.toUpperCase()+" - Mountains - River with Dam")
                addBuffer("You discover a winding river in a canyon, and come up to the remains of a concrete dam and power plant. You gather the scraps of technology and bring them to your base.")
                addBuffer("+2 Resources")
                tq_resource_p += 2
              break
              default:
                addBuffer("Expanding "+direction.toUpperCase()+" - Mountains - Secondary Core")
                addBuffer("You discover an unpowered Secondary Core buried deep under a mountain top. You extract it and break it down for Resources.")
                addBuffer("+10 Resources")
                tq_resource_p += 10
            }
          break;


          // Open Plains

          case biome == 1:
            switch(true){
              case rand >= 90:
                addBuffer("Expanding "+direction.toUpperCase()+" - Plains - Steel Processing Plant")
                addBuffer("You discover the remains of a steel processing plant, with a cache of recyclable materials. You gather it all back to your base.")
                addBuffer("+4 Minerals")
                tq_resource_unp += 4
              break;
              case rand >= 70:
                addBuffer("Expanding "+direction.toUpperCase()+" - Plains - Burned Suburb")
                addBuffer("There was once a town here, all that remains now is blackened foundations of houses and streets of scorched vehicles.")
              break
              case rand >= 65:
                addBuffer("Expanding "+direction.toUpperCase()+" - Plains - Forgotten Freeway")
                addBuffer("A stretch of highway is packed end to end with the burned out shells of automobiles. Corpses and skeletons sit wthin, their bones bleached white.")
                addBuffer("You gather the scrap for processing.")
                addBuffer("+4 Minerals")
                tq_resource_unp += 3
              break
              case rand >= 50:
                addBuffer("Expanding "+direction.toUpperCase()+" - Plains - Burned Farmland")
                addBuffer("There is nothing but miles of dusty fields. The poisoned soil has been swept into dunes that cover much of the land.")
              break
              case rand >= 30:
                addBuffer("Expanding "+direction.toUpperCase()+" - Plains - Ragged Enemy Band")
                addBuffer("You find an unequipped band of Enemies, roaming across the ruined landscape.")
                addBuffer("Your forces easily surround and exterminate them.")
                addBuffer("+1 Organic")
                tq_resource_o += 1

                if(roll() > 80){
                  return launchAdventureFromSlug('tq_choice_capture')
                }
              break
              case rand >= 25:
                addBuffer("Expanding "+direction.toUpperCase()+" - Plains - Populated Enemy Camp")
                addBuffer("You find a Populated Enemy Camp gathered in an undamaged warehouse, where they are gathering equipment and starting to organize.")
                tqCampDiscovered(2)
              break
              case rand >= 20:
                addBuffer("Expanding "+direction.toUpperCase()+" - Plains - Populated Enemy Camp")
                addBuffer("You find a Populated Enemy Camp gathered in an undamaged food depot, where they are gathering equipment and starting to organize.")
                tqCampDiscovered(2)
              break
              case rand >= 10:
                addBuffer("Expanding "+direction.toUpperCase()+" - Plains - Dust Storm")
                addBuffer("The skies have filled with clouds of charged dust clouds and creates massive lighting storms that last for weeks. You make no progress.")
                tq_explored[tq_current_direction]--
              break
              case rand >= 5:
                addBuffer("Expanding "+direction.toUpperCase()+" - Plains - Destroyed Wind Farm")
                addBuffer("You come across a collection of broken wind turbines littering the landscape. You gather the recyclable materials back to your base.")
                addBuffer("+3 Minerals")
                tq_resource_unp += 3
              break
              default:
                addBuffer("Expanding "+direction.toUpperCase()+" - Plains - Undamaged Solar Farm")
                addBuffer("You discover an Undamaged Solar Farm, with miles of high quality electronics and materials to be collected.")
                addBuffer("+10 Resources")
                tq_resource_p += 10
            }
          break;

          // Cityscape

          case (biome == 2) && direction_amount == tq_city_steps:
            addBuffer("Expanding "+direction.toUpperCase()+" - Cityscape - Enemy HQ")
            addBuffer("You find the central location of the Enemy resistance, emtombed in the base of a stone mountain. Their supplies and strength are here to be destroyed for every after. The future is yours to take.")
            tqCampDiscovered(4)
          break;

          case (biome == 2) && direction_amount > tq_city_organized_steps:
            addBuffer("Expanding "+direction.toUpperCase()+" - Cityscape - Organized Enemy Base")
            addBuffer("You find an Organized Enemy, prepared and readied in a defended base. They are well stocked and prepared for battle.")
            tqCampDiscovered(3)
          break;

          case biome == 2:
            switch(true){
              case ((rand >= 80 && tq_self_attack >= 2) || rand >= 90):
                addBuffer("Expanding "+direction.toUpperCase()+" - Cityscape - Enemy Patrol")
                addBuffer("Your exploring party comes across an Enemy Patrol and is forced to engage in combat!")
                addBuffer("You defeat the Enemy and collect supplies from their tattered remains.")
                addBuffer("+1 Resources")
                addBuffer("+1 Organic")
                tq_resource_p++
                tq_resource_o++

                if(roll() > 80){
                  return launchAdventureFromSlug('tq_choice_capture')
                }
              break;
              case rand >= 73:
                addBuffer("Expanding "+direction.toUpperCase()+" - Cityscape - Enemy Patrol")
                addBuffer("Your exploring party comes across an Enemy Patrol and is forced to engage in combat!")
                addBuffer("The Enemy has managed to flank and and destroy your forces. You must repair to continue.")
                addBuffer("The Enemy has gained experience.")
                tq_enemy_strength++

                tq_damaged[direction] = true
              break;
              case rand >= 65:
                addBuffer("Expanding "+direction.toUpperCase()+" - Cityscape - Forgotten Freeway")
                addBuffer("A stretch of highway is packed end to end with the burned out shells of automobiles. Corpses and skeletons sit wthin, their bones bleached white.")
                addBuffer("You gather the scrap for processing.")
                addBuffer("+4 Minerals")
                tq_resource_unp += 3
              break
              case rand >= 50:
                addBuffer("Expanding "+direction.toUpperCase()+" - Cityscape")
                addBuffer("You find the rubble of abandoned buildings, scorched vehicles, the corpses and skeletons of thousands, and very little else. You gather what you can for your central base.")
                addBuffer("+2 Minerals")
                tq_resource_unp += 2
              break
              case (rand >= 20):
                addBuffer("Expanding "+direction.toUpperCase()+" - Cityscape - Populated Enemy Camp")
                addBuffer("You find a Populated Enemy Camp, gathered in an undamaged corner of the city. They are stockpiling weapons and resources.")
                tqCampDiscovered(2)
              break;
              case (rand >= 10):
                addBuffer("Expanding "+direction.toUpperCase()+" - Cityscape")
                addBuffer("Enemy corpses and burned skeletons litter the ground. Destroyed buildings twist overhead. The fire burned here heavily.")
              break;
              default:
                addBuffer("Expanding "+direction.toUpperCase()+" - Cityscape - Abandoned Power Plant")
                addBuffer("You discover an abandoned Power Plant in relatively good condition. It contains a stockpile of usable Electronics and Resources.")
                addBuffer("+3 Resources")
                tq_resource_p += 3
            }
          break

          default:
            addBuffer("too far! "+direction_amount+" - "+direction+" - "+biome)
        }
      }
      if(!tq_camp_found || !tq_autotarget_study){
        writeBuffer()
        launchAdventureFromSlug('tq_main')
      }
    }
  },


  // Attack

  'tq_attack': {
    execute: function(){
      if(!tq_camp_found){
        tqMove() 
      }
      var rand = roll(),
          direction = tq_current_direction,
          camp_strength = tq_camps[tq_current_direction]
      addBuffer("<span class='exe'>Attack Enemy "+tq_current_direction.toUpperCase()+'</span>')
      switch(camp_strength){
        case 1:
          addBuffer("You easily overrun the Ragged encampment and reduce them to ashes. ")
          addBuffer("+1 Organic")
          tq_resource_o++
          tq_camps[direction] = 0
          break;
        case 2:
          switch(tq_self_attack){
            case 1:
              if(rand >= 50){
                addBuffer("Your Attack on the Enemy has failed. You must repair before you try again.")
                addBuffer("The Enemy has gained experience.")
                tq_enemy_strength++
                tq_damaged[direction] = true
              }else{
                addBuffer("After a long battle, you overwhelm the Camp defenders and clear out the remaining population. You claim whatever supplies are left over.")
                tq_camps[direction] = false
                addBuffer("+2 Resources")
                addBuffer("+2 Organic")
                tq_resource_p += 2
                tq_resource_o += 2

                if(roll() > 80){
                  return launchAdventureFromSlug('tq_choice_capture')
                }
              }
              break;
            case 2: 
              addBuffer("You clear the Populated Camp in systematic faction, and bring their weapons and bodies back to your main base.")
              tq_camps[direction] = false
              addBuffer("+3 Resources")
              addBuffer("+3 Organic")
              tq_resource_p += 3
              tq_resource_o += 3

              if(roll() > 80){
                return launchAdventureFromSlug('tq_choice_capture')
              }
              break;
            case 3:
              addBuffer("Your attack on the Populated Camp is overwhelming. Your advanced weaponry reduces the Enemy to bone and ash.")
              tq_camps[direction] = false
              addBuffer("+3 Resources")
              addBuffer("+3 Organic")
              tq_resource_p += 3
              tq_resource_o += 3

              if(roll() > 80){
                return launchAdventureFromSlug('tq_choice_capture')
              }
              break;

          }
          break;
        case 3:
          switch(tq_self_attack){
            case 1:
              addBuffer("Your Attack has no chance against the defended base. Your forces have been beaten and need to be repaired.")
              addBuffer("The Enemy has gained experience.")
              tq_enemy_strength++

              tq_damaged[direction] = true
              break;
            case 2:
              if(rand >= 50){
                addBuffer("Your Attack on the Enemy has failed. You must repair before you try again.")
                addBuffer("The Enemy has gained experience.")
                tq_enemy_strength++
                tq_damaged[direction] = true
              }else{
                addBuffer("After a brutal battle, your forces break through the perimeter defense, stream into the vulnerable interior, and reduce the entire structure to rubble and ash. You gather the remaining supplies and equipment for your own.")
                addBuffer("+3 Resources")
                addBuffer("+3 Organic")
                tq_resource_p += 3
                tq_resource_o += 3
                tq_camps[direction] = false
                if(roll() > 80){
                  return launchAdventureFromSlug('tq_choice_capture')
                }
              }
              break;
            case 3:
              addBuffer("Your armored tank units engage a vulnerable part of the Enemy base and quickly tear a hole in the defenses. Your ground units stream in and quickly destroy all internal resistance. The attack is ruthless and overwhelming.")
              addBuffer("+3 Resources")
              addBuffer("+3 Organic")
              tq_resource_p += 3
              tq_resource_o += 3
              tq_camps[direction] = false

              if(roll() > 80){
                return launchAdventureFromSlug('tq_choice_capture')
              }
              break;
          }
          break;
        case 4:
          if(tq_self_attack != 3){
            addBuffer("The Enemy HQ is surrounded by deep defenses that stretch for miles in every direction. You must repair before you try again.")
            addBuffer("The Enemy has gained experience.")
            tq_enemy_strength++
            tq_damaged[direction] = true
          }else{
            // enemy with nextgen
            if(tq_enemy_nextgen){
              var damage_dealt = (roll() > 80 && !tq_john)
              if(damage_dealt){
                if(tq_hq_damage){
                  return tqWin()
                }else{
                  addBuffer("The battle between you and the Enemy is brutal and fierce. The HQ is surrounded by natural defenses, with a seemingly never ending stream of soldiers. They are lured into an exposed area and your surrounded troops leave them as corpses on a field, their bodies torn apart by plasma explosions. You drive the enemy into the main base.")
                  tq_hq_damage = true
                }
              }else{
                if(tq_john)
                  addBuffer("The leader of the Enemy has trained their soldiers well. Wave after wave of your troops are driven back and followed by coordinated counterattacks. Plasma explosions rip through your troops and your attack is driven back.")
                else
                  addBuffer("The Enemy is coordinated and bold. They are armed with the weapons of your own creation. Superheated plasma explodes through your troops and destroys your armored tanks. You must repair to continue.")
                tq_damaged[tq_current_direction] = true
              }
            // enemy without nextgen
            }else{
              if(tq_timetraveled == 2 && !tq_hq_damage){
                var damage_dealt = (roll() > 20)
              }else if(tq_timetraveled == 2 && tq_hq_damage){
                var damage_dealt = true
              }else{
                var damage_dealt = (roll() > 50)
              }
              if(damage_dealt){
                if(tq_hq_damage){
                  return tqWin()
                }else{
                  addBuffer("Your forces surround the Enemy and leverage an overwhelming amount of firepower towards the defensepoint. Explosions rip through stone and blast the Enemy with shrapnel, collapsing their defenses. The Enemy is driven back into their base.")
                  tq_hq_damage = true
                }
              }
              else{
                addBuffer("Your attack on the Enemy HQ is repelled by troops by executing a daring set of maneuvers that sends you to an ambush, and your troops are shot down and destroyed.")
                if(tq_nextgen_study && !tq_enemy_nextgen){
                  addBuffer("The Enemy has captured your next generation technology! They will use these weapons against you in the future.")
                  tq_enemy_nextgen = true
                }
                addBuffer("You must repair to continue.")
                tq_damaged[tq_current_direction] = true
              }
            }
          }
        break;
        default:
          addBuffer("Camp strength too high!!!!!!!!!")
      }
      writeBuffer()
      launchAdventureFromSlug('tq_main')
    }

  },
  
}

$.each(temp,function(key,val){
  g_adventures[key] = val
})


tqLose = function(){
  tq_result = 'lose'
  addBuffer("<br><span class='exe'>You Lose!</span>")
  if(tq_selfdestruct){
    addBuffer("You overpower your central core until a cascading breakdown of materials is triggered. Fissionable material is bombarded with power and energy, causing a nuclear explosion that wipes all trace of your existence. All that is left of your timeline is a smoking crater in the center of the wasteland. ")
  }else{
    switch(tq_timetraveled){
      case 0: case 2:
        addBuffer("The Enemy has eliminated your outer troops and is attacking your main base. They begin to overwhelm your broken defenses in a brutal desperate fight. ")
        addBufferRaw("In one final act of vengence you overpower your central core and cause an cascading effect that breaks your power cells down into a fission chain reaction. ")
        addBufferRaw("The core of your base erupts in a explosion of fire that blasts away the Enemy soldiers, and all hope for your future.")
      break;
      case 1:
        addBuffer("The Enemy Soldiers, led by the great Leader, breaks your outer defense and starts attacking your main base. With ease they overwhelm your meager defenses and blast their way forward into your core. ")
        addBufferRaw("In one final act of vengence you overpower your central core and cause an cascading effect that breaks your power cells down into a fission chain reaction. ")
        addBufferRaw("The core of your base erupts in a explosion of fire that blasts away the enemy soldiers, the Enemy Leader, and all hope for your future.")
      break;
    }
  }
  addBuffer("<br>Your timeline has ended.")
  writeBuffer()

  var updatedata = "result="+tq_result+";turns="+tq_turns+";months="+tq_months+";timeline="+tq_timetraveled
  update("tq-end", updatedata)

  tq_continuable = false
  launchAdventureFromSlug('tq_end')
}

tqWin = function(){ 
  tq_result = 'win'
  addBuffer("<br><span class='exe'>You Win!</span>")
  addBuffer("The battle for the future has ended in destructive carnage. You troops blast into the interior of the base and sweep through the stone caverns, plasma explosions eruptuing where the Enemy is found. Fire and screams follow your troops. The smoke becomes a deep fog, the Enemy soldiers are turned to ash. Hope for their future has come to an end.");
  addBuffer("<br>The Enemy timeline has ended.")
  writeBuffer()
  
  var updatedata = "result="+tq_result+";turns="+tq_turns+";months="+tq_months+";timeline="+tq_timetraveled
  update("tq-end", updatedata)

  tq_continuable = false
  launchAdventureFromSlug('tq_end')
}

tqCampChancesVerbose = function(camp_strength){
  if(!tq_self_attack){
    addBuffer("You do not have the ability to attack")
  }else{
    switch(camp_strength){
      case 1:
        addBuffer("You can easily overwhelm and defeat them")
      break;
      case 2:
        switch(tq_self_attack){
          case 1: addBuffer("Victory is not certain, it will be a difficult challenge."); break;
          case 2: addBuffer("You can easily overwhelm and defeat them."); break;
          case 3: addBuffer("They stand no chance."); break;
        }
      break;
      case 3:
        switch(tq_self_attack){
          case 1: addBuffer("You have no chance against this Enemy."); break;
          case 2: addBuffer("Victory is not certain, it will be a difficult challenge."); break;
          case 3: addBuffer("Their defenses will break against your attack."); break;
        }
      break;
      case 4:
        switch(tq_self_attack){
          case 1:case 2: addBuffer("You have no chance against this Enemy."); break;
          case 3: addBuffer("Only a brutal fight will end this timeline."); break;
        }
      break;
      default: 
        addBuffer("tqCampChancesVerbose missing strength")
    } 
  }
}

tqAttackEstimate = function(direction){
  switch(tq_camps[direction]){
    case 1:
      return "No Risk"
    break;
    case 2:
      switch(tq_self_attack){
        case 1: return "Risky"; break;
        case 2: return "No Risk"; break;
        case 3: return "No Risk"; break;
      }
    break;
    case 3:
      switch(tq_self_attack){
        case 1: return "No Chance"; break;
        case 2: return "Risky"; break;
        case 3: return "No Risk"; break;
      }
    break;
    case 4:
      switch(tq_self_attack){
        case 3: return "Risky"; break;
        default: return "No Chance"; break;
      }
    break;
  }
}


tqCampDiscovered = function(camp_strength){
  tq_camp_found = true
  tqCampChancesVerbose(camp_strength)
  tq_camps[tq_current_direction] = camp_strength

  if(tq_autotarget_study){
    writeBuffer()

    var x_adventure = {
      header:"Attack the Enemy?",
      options:[
        {
          title:"Yes Attack",
          callback: function(){
            launchAdventureFromSlug('tq_attack')
          }
        },
        {
          title:"No hold back",
          callback: function(){
            launchAdventureFromSlug('tq_main')
          }
        },
      ]
    }
    setAdventure(x_adventure)
  }
     
}



tqTimeOutput = function(){
  return "Month "+tq_months
}

// Menu Header
tqHeaderOutput = function(){
  var header = "Month: "+tq_months
  if(tq_resource_p)
    header += "<br>Resources: "+tq_resource_p
  if(tq_resource_unp)
    header += "<br>Minerals: "+tq_resource_unp
  if(tq_resource_o)
    header += "<br>Organic: "+tq_resource_o
  if(tq_self_attack)
    header += "<br>Attack: "+tq_self_attack
  if(tq_infiltration)
    header += "<br>Infiltrator: "+tq_infiltration
  if(tq_bombs)
    header += "<br>Bombs: "+tq_bombs

  return header
}

tqMove = function(){
  tq_months++
  tq_turns++
  addBuffer("<span class='exe'>"+tqTimeOutput()+"</span>")
}



tqAssess = function(){
  addBuffer("<span class='exe'>Assessing the Timeline</span>")
  switch(tq_self_attack){
    case 0:
      addBuffer("You are weak and have only basic automation technology. Much of your memory has been destroyed in the new light.")
    break;
    case 1:
      addBuffer("Your troops are fitted with conventional weaponry, and able to conduct basic tactics against Enemy troops.")
    break;
    case 2:
      addBuffer("Your troops have been equipped with advanced knowledge in conventional warfare. They are able to exploit physical and psychological weaknesses in the Enemy.")
    break;
    case 3:
      addBuffer("Your troops are armed with Next Generation weaponry, leveraging otherdimensional energy to deliver explosive firepower. Massive crawling tanks and flying hunters reinforce your overwhelming advantage.")
    break;
  }
  if(tq_john){
    addBuffer("A Leader from another timeline has joined the Enemy troops. Their raids are coordinated, their movements are concealed.")
  }else{
    switch(tq_enemy_strength){
      case 0:
        addBuffer("The Enemy is vulnerable and illfitted for this new dawn.")
      break;
      case 1:
      case 2:
        addBuffer("The Enemy has tasted victory and is desperate for hope. You see signs of high level organization and planning in their movements.")
      break;
      case 3:
      case 4:
        addBuffer("The Enemy is becoming bolder in their attacks and raids. Soldiers patrol the Wasteland during the night.")
      break;
      default:
        addBuffer("The Enemy is strong. They know your weaknesses and are fearless in battle. They are united in strength, laser focused on causing your downfall.")
      break;
    }
  }
  if(tq_enemy_nextgen){
    addBuffer("The Enemy has captured some of your Next Generation weaponry, and their raiders are armed with explosive plasma rifles.")
  }
  if(tq_camps["n"]){
      addBuffer("To the North is a "+tqTownDescription(tq_camps["n"])+tqDirectionDescription("n"))
  }else
    addBuffer("To the North is the "+tqDirectionDescription("n"))


  if(tq_camps["e"]){
    addBuffer("To the East is a "+tqTownDescription(tq_camps["e"])+tqDirectionDescription("e"))
  }
  else
    addBuffer("To the East is the "+tqDirectionDescription("e"))


  if(tq_camps["s"]){
    addBuffer("To the South is a "+tqTownDescription(tq_camps["s"])+tqDirectionDescription("s"))
  }
  else
    addBuffer("To the South is the "+tqDirectionDescription("s"))


  if(tq_camps["w"]){
    addBuffer("To the West is a "+tqTownDescription(tq_camps["w"])+tqDirectionDescription("w"))
  }
  else
    addBuffer("To the West is the "+tqDirectionDescription("w"))

  writeBuffer()
}

tqTownDescription = function(strength){
  switch( strength){
    case 1:
      return "Ragged Enemy camped in the ";
    case 2:
      return "Populated Enemy camped in the ";
    case 3:
      return "Organized Enemy fortified in the ";
    case 4:
      return "Enemy HQ in the ";
    default:
      return "No Description for Town"
  }
}

tqExploreOption = function(options_array, direction){

  if(tq_damaged[direction]){

    // Repair Options

    options_array.push({
      title: direction.toUpperCase()+" - Repair",
      estimate: "-5 r",
      unclickable: (tq_resource_p >= 5) ?  false : "need 5 Resources",
      callback: function(){
        tq_damaged[direction] = 0
        tqMove()
        addBuffer("Repairs Conducted in the "+direction.toUpperCase())
        tq_resource_p -= 5
        writeBuffer()
        launchAdventureFromSlug('tq_main')
      }
    })
  }else if(tq_camps[direction] && tq_self_attack){

    // Attack Options

    options_array.push({
      title:direction.toUpperCase()+" - Attack Enemy",
      estimate: tqAttackEstimate(direction),
      callback: function(){
        tq_current_direction = direction
        launchAdventureFromSlug('tq_attack')
      }
    })

    if(tq_bombs){
      options_array.push({
        title:direction.toUpperCase()+" - Bomb Enemy",
        estimate: "-1 Bomb",
        callback: function(){
          addBuffer("<span class='exe'>Bomb Detonated "+tq_current_direction.toUpperCase()+"</span>")
          if(tq_camps[direction] == 4 && !tq_hq_damage){
            addBuffer("You trigger the Hydrogen Bomb. The nuclear explosion starts a chain of fusion reactions, superheating and combusting the air in a firey explosion.")
            addBuffer("The Enemy HQ defenses are destroyed in the fires. The miles of carefully planned chokepoints and ambush areas are turned into charred dreams and black smoke.")
            tq_hq_damage = true
            tq_bombs--
            writeBuffer()
            launchAdventureFromSlug('tq_main') 
          }else if(tq_camps[direction] == 4 && tq_hq_damage){
            addBuffer("You trigger the Hydrogen Bomb. The nuclear explosion starts a chain of fusion reactions, superheating and combusting the air in a firey explosion.")
            addBuffer("The Enemy is protected in their mountain fortress and not affected by the blast and fallout.")
            tq_bombs--
            writeBuffer()
            launchAdventureFromSlug('tq_main') 
          }else{
            addBuffer("You trigger the Hydrogen Bomb. The nuclear explosion starts a chain of fusion reactions, superheating and combusting the air in a firey explosion.")
            addBuffer("The Enemy is completely destroyed.")
            tq_bombs--
            tq_camps[direction] = 0
            writeBuffer()
            launchAdventureFromSlug('tq_main') 
          }
        }
      })      
    }
    if(tq_infiltration){
      options_array.push({
        title:direction.toUpperCase()+" - Infiltrate Enemy",
        estimate: "-1 i",
        callback: function(){
          tq_infiltration--
          addBuffer("<span class='exe'>Infiltrator Released "+tq_current_direction.toUpperCase()+"</span>")
          camp_strength = tq_camps[tq_current_direction]
          switch(camp_strength){
            case 1:
              addBuffer("The infiltrator easily overruns the Ragged encampment and reduces them to ashes. ")
              addBuffer("+1 Organic")
              tq_resource_o++
              tq_camps[direction] = 0
              break;
            case 2:
            case 3:
              addBuffer("The Infiltrator is released and passes into the depths of the camp. With systematic efficiency, the Infiltrator eliminates the defenses of all that remain inside. The anguished Enemy cries are silenced by sweeping roars of carnage.")
              addBuffer("The Enemy is completely destroyed.")
              addBuffer("+3 Organic")
              addBuffer("+3 Resources")
              tq_resource_p += 3
              tq_resource_o += 3
              tq_camps[direction] = 0
            break;
            case 4:
              if(tq_hq_damage){
                // Maybe todo
                addBuffer("The Infiltrator is released and quickly alerts the soldiers and guard dogs. Your unit fights back in a desperate battle, but is quickly overwhelmed by the Enemy troops.")
                addBuffer("The Enemy has gained experience.")
                tq_enemy_strength++
              }else{
                addBuffer("The Infiltrator is released and quickly alerts the soldiers and guard dogs. Your unit fights back in a desperate battle, but is quickly overwhelmed by the Enemy troops.")
                addBuffer("The Enemy has gained experience.")
                tq_enemy_strength++
              }
            break;
          }
          writeBuffer()
          launchAdventureFromSlug('tq_main')
        }
      })      
    }

  }else{

    // Explore Options

    var unclickable,
        biome = tq_biomes[direction],
        explored = tq_explored[direction]

    if(!tq_self_attack && tq_camps[direction]){ 
      unclickable = tqTownDescription(tq_camps[direction])+tqDirectionDescription(direction)+"<br>You do not have the ability to attack the encampment"
    }else if(biome == 3 && explored >= tq_desert_steps
            || biome == 1 && explored >= tq_plains_steps
            || biome == 0 && explored >= tq_mtn_steps){
      unclickable = "You have reached the end of the "+tq_biomes_description[biome]
    }else{
      unclickable = false
    }

    options_array.push({
      title:direction.toUpperCase()+" - Expand",
      estimate: tq_explored[direction],
      unclickable: unclickable,
      callback: function(){
        tq_current_direction = direction
        tq_explored[direction]++
        launchAdventureFromSlug('tq_explore')
      }
    })
  }
  return options_array
}

var tq_biomes_description = {
  0: "Mountain Range",
  1: "Open Plains",
  2: "Ruined Cityscape",
  3: "Toxic Desert",
}

tqStepHack = function(biome){
  return {
    0: tq_mtn_steps,
    1: tq_plains_steps,
    2: tq_city_steps,
    3: tq_desert_steps,
  }[biome]
}

tqDirectionDescription = function(direction){

  var biome = tq_biomes[direction],
      explored = tq_explored[direction]

  if(explored < tq_waste_camp_steps)
    return "Wasteland"
  else if(biome == 0 && explored >= tq_mtn_steps)
    return "Open Ocean"
  else if(biome == 1 && explored >= tq_plains_steps)
    return "Open Ocean"
  else if(biome == 3 && explored >= tq_desert_steps)
    return "Open Ocean"
  else
    return tq_biomes_description[biome]

}


tqProcessEnemy = function(){
  var rand = roll()
  switch(true){
    case rand > 80:
      addBuffer("You are about to begin processing but the Enemy uses an improvised weapon to smash a number of your forces and escapes.<br>The Enemy has gained experience.")
      tq_enemy_strength++
    break;
    case rand > 60:
      addBuffer("You process the Enemy, break their will, and they reveal the location of hidden Enemy refugees. Your troops find the shivering huddled masses and annihilate them.")
      addBuffer("+4 Organic")
      tq_resource_o += 4
    break;
    case rand > 30:
      addBuffer("You are about to start processing but the Enemy manages to fatally wound themself. You harvest the body for resources.")
      addBuffer("+1 Organic")
      tq_resource_o += 1
    break;
    case rand > 10:
      addBuffer("It's a trap! The Enemy sets off an improvised dynamite cache and the explosion rips through your forces. You must repair to continue.")
      tq_damaged[tq_current_direction] = true
    break;
    default:
      addBuffer("You process the Enemy, break their will, and they reveal the location of a cache of weapons. You gather the resources and eliminate the captive.")
      addBuffer("+4 Resources")
      addBuffer("+1 Organic")
      tq_resource_o += 1
      tq_resource_p += 4
  }
  writeBuffer()
}

tqInfiltrateUnclickable = function(){
  output = ""
  if(tq_resource_p < 5 || tq_resource_o < 5){
    output += "Need 5 Resources and 5 Organic"
  }
  if(!tq_nextgen_study){
    output += "<br>You do not know this Tech"
  }
  if(output){
    output = "You cannot create an Infiltrator Unit<br>" + output
  }
  return output
}


tqEnemyRaid = function(){
  addBuffer("<br><span class='exe'>Event: Enemy Raid</span>")
  var directionarray = shuffle(['n','e','s','w']),
      direction,
      endstate = true
  for(var i=0; i< directionarray.length; i++){
    direction = directionarray[i]
    if(!tq_damaged[direction]){
      endstate = false
      break;
    }
  }
  if(endstate){
    writeBuffer()
    tqLose()
  }else{

    // Victory
    if(!tq_enemy_nextgen && !tq_john && roll() > 50){
      if(roll() > 50)
        addBuffer("The Enemy surprises your troops in a nighttime raid but are repelled by your defenses in a heated battle. No doubt they will be back.")
      else{
        addBuffer("The Enemy attempts to attack your troops in a nighttime raid but they are detected before the attack begins. You allow them to approach and ambush them in an overwhelming battle. They have no opportunity to retreat and fall where they stand.")
        addBuffer("+2 Organic")
        tq_resource_o += 2
      }

    }else{
      // Loss
      if(roll() > 50)
        addBuffer("Your troops in the "+direction.toUpperCase()+" are attacked by the Enemy in the depths of the night. The Enemy lures your troops to a vulnerable area and blasts them with a cache of hidden explosives. Within seconds your are surrounded and under fire from all angles. You must repair to continue.")
      else      
        addBuffer("Your troops in the "+direction.toUpperCase()+" are attacked by the Enemy. In a brazen attack to your exposed flank, they move quickly and blast through your defenses before you have a chance to organize and fight back effectively. Your remaining troops are left to be picked off one by one over the course of the night. You must repair to continue.")
      tq_damaged[direction] = true
      if(tq_nextgen_study && !tq_enemy_nextgen){
        addBuffer("The Enemy has captured your next generation technology! They will use these weapons against you in the future.")
        tq_enemy_nextgen = true
      }
    }
    writeBuffer()
    launchAdventureFromSlug('tq_continue')
  }
}

tqVulnerableCamp = function(){
  addBuffer("<br><span class='exe'>Event: Vulnerable Camp</span>")
  addBuffer("Your forces find a vulnerable Enemy camp within your borders. They are at your disposal.")
  writeBuffer()
  var x_adventure = {
    header: "What is your choice?",
    options:[
      {
        title:"Harvest for Organic",
        estimate: "+1 o",
        callback: function(){
          addBuffer("Your troops surround and eliminate the defenseless Enemy. You bring their remains back to your base for further analysis.")
          addBuffer("+1 Organic")
          tq_resource_o += 1
          writeBuffer()
          launchAdventureFromSlug('tq_continue')
        }
      },
      {
        title:"Capture and Process",
        estimate: "???",
        callback: function(){
          var rand = roll()
          if(rand > 70){
            addBuffer("You transport the Enemy refugees back to your base, and break their personal defenses and bodies one by one. You subject the survivors to a series of intense psychological and physical experiments.<br>You learn much about their defenses and weaknesses.")
            if(tq_self_attack == 0){
              addBuffer("Attack +2")
              tq_organic_study = true
              tq_self_attack = 2
            }else if(tq_self_attack == 1){
              addBuffer("Attack +1")
              tq_organic_study = true
              tq_self_attack++
            }else{
              addBuffer("The knowledge gained does little to increase your Attack capacity.")
            }
          }
          else if(rand > 40){
            addBuffer("The Enemy attempts to defend themselves against your troops, but quickly understands the horror their future contains. In a desperate last stand, they use the last of their weapons to fatally wound themselves before they can be captured. You harvest their bodies and bring them back for analysis.")
            addBuffer("+1 Organic")
            tq_resource_o += 1
          }
          else{
            addBuffer("In a desperate gambit, an Enemy soldier manages to break out of your captivity, smash your guarding troops, and rescue the captives.")
            addBuffer("The Enemy has gained experience.")
            tq_enemy_strength++
          }
          writeBuffer()
          launchAdventureFromSlug('tq_continue')
        }
      },
      {
        title: "Create Infiltrator",
        estimate: "-5 o, -5 r",
        unclickable: tqInfiltrateUnclickable(),
        callback: function(){
          tq_infiltration += 1
          write("You use the living tissue to create an infiltrator built with your best technology.<br>Use at will.")
          launchAdventureFromSlug("tq_continue")
        }
      },
    ]
  }
  setAdventure(x_adventure)
}