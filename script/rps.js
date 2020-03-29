

rps_strings = {
  '11':["They bounce off each other and send splinters everywhere.",
        "No one wins in a Rock fight.",
        "Two rocks. Zero answers. Nothing but pain."],
  '12':["Good old Rock. Nothing beats that. Except Paper.",
        "In all friendships we try to cover each other. In this friendship n0va wins."],
  '13':["Your Rock crushes n0va's Scissors."],
  '21':["Your Paper smothers n0va's Rock."],
  '22':["Stacks on stacks on stacks. Let's play again."],
  '23':["Your Paper gets cut up into shreds by n0va's Scissors.",
        "A paper cut. What does it mean. To take down a tree?  What about the paper?"],
  '31':["Your Scissors are left as a lump of useless twisted metal.",
        "The tools of man stand  no chance to the forces of nature. Your scissors are smashed to bits."],
  '32':["n0va's Paper is left at your mercy but this game leaves no room for that.",
        "The pressed pulp of trees does not stand up to the sharpened tools of Man."],
  '33':["Clang Clang!! Sparks fly but nothing happens.",
        "What is to be cut with two scissors and nothing else?"],
}


g_rps_total = 0
g_rps_wins = 0
g_rps_loses = 0
g_rps_draws = 0
g_rps_max_streak = 0
g_rps_current_streak = 0

temp = {

  'rockpaperscissor':{
    execute: function(){
      var x_adventure = {
        header: "Choose",
        back: 'nova_games',
        options: [
          {
            title:"ROCK!",
            callback: function(){
              g_rockpaperscissor = 1
              launchAdventureFromSlug('rockpaperscissor_callback')
            }
          },
          {
            title:"PAPER!",
            callback: function(){
              g_rockpaperscissor = 2
              launchAdventureFromSlug('rockpaperscissor_callback')
            }
          },
          {
            title:"SCISSOR!",
            callback: function(){
              g_rockpaperscissor = 3
              launchAdventureFromSlug('rockpaperscissor_callback')
            }
          },
          {
            title:"Stats",
            callback: function(){
              update('rpsstats','total='+g_rps_total+'wins='+g_rps_wins+'losses='+g_rps_loses+'maxstreak='+g_rps_max_streak)
              write("You currently have:<br>"+g_rps_total+" total games<br>"+g_rps_wins+" total wins - "+rpsPercentage(g_rps_wins)+"<br>"+g_rps_loses+" total losses - "+rpsPercentage(g_rps_loses)+"<br>"+g_rps_draws+" total draws - "+rpsPercentage(g_rps_draws)+"<br>"+g_rps_max_streak+" max winning streak")
              launchAdventureFromSlug('rockpaperscissor')
            }
          },
        ]
      }
      setAdventure(x_adventure)
    }
  },

  'rockpaperscissor_callback': {
    execute: function(){
      var rando = Math.floor(Math.random() * 3) + 1
      switch(g_rockpaperscissor){
        case 1:
          addBuffer("You choose Rock")
        break;
        case 2:
          addBuffer("You choose Paper")
        break;
        case 3:
          addBuffer("You choose Scissors")
        break;
      }
      switch(rando){
        case 1:
          addBuffer("n0va chooses Rock")
        break;
        case 2:
          addBuffer("n0va chooses Paper")
        break;
        case 3:
          addBuffer("n0va chooses Scissors")
        break;
      }
      var matchString = g_rockpaperscissor+""+rando
      rpsWriteFrom(matchString)
      switch(matchString){
        case "11":
          rpsDraw()
        break;
        case "12":
          rpsLose()
        break;
        case "13":
          rpsWin()
        break;
        case "21":
          rpsWin()
        break;
        case "22":
          rpsDraw()
        break;
        case "23":
          rpsLose()
        break;
        case "31":
          rpsLose()
        break;
        case "32":
          rpsWin()
        break;
        case "33":
          rpsDraw()
        break;
      }
      g_rps_total++
      writeBuffer()
      launchAdventureFromSlug('rockpaperscissor')
    }
  },

}


$.each(temp,function(key,val){
  g_adventures[key] = val
})


rpsWriteFrom = function(str){
  var arr = rps_strings[str]
  var out = arr[Math.floor(Math.random() * arr.length)]
  addBuffer(out)
}


rpsDraw = function(){
  g_rps_draws++
  addBuffer("Draw Game!")
  g_rps_current_streak = 0
}

rpsLose = function(){
  g_rps_loses++
  addBuffer("You Lose!")
  g_rps_current_streak = 0
}

rpsWin = function(){
  g_rps_wins++
  addBuffer("You Win!")
  g_rps_current_streak++
  if(g_rps_current_streak > g_rps_max_streak) g_rps_max_streak = g_rps_current_streak
}

rpsPercentage = function(amount){
  if(!g_rps_total){
    return "0%"
  }else{
    return Math.round(100*amount/g_rps_total)+"%"
  }
  
}