

temp = {
  //
  //   telnet
  //
  //        ____            _
  //    ___ \   \  __   _  | \    
  //   / _ \ \ \ \ \ \ | | |  \  
  //   \ \\ \ \ \ \ \ \| | |   \
  //    |_||_| \___| \___| | || \      
  //                       |_||__\
  //    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   
  //          
     
  telnet:{
    execute: function(){
      output = "<span class='exe'>"
      output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;____&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>"
      output += "&nbsp;___&nbsp;\\&nbsp;&nbsp;&nbsp;\\&nbsp;&nbsp;__&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;|&nbsp;\\&nbsp;&nbsp;&nbsp;&nbsp;<br>"
      output += "/&nbsp;_&nbsp;\\&nbsp;\\&nbsp;\\&nbsp;\\&nbsp;\\&nbsp;\\&nbsp;|&nbsp;|&nbsp;|&nbsp;&nbsp;\\&nbsp;&nbsp;&nbsp;<br>"
      output += "\\&nbsp;\\\\&nbsp;\\&nbsp;\\&nbsp;\\&nbsp;\\&nbsp;\\&nbsp;\\|&nbsp;|&nbsp;|&nbsp;&nbsp;&nbsp;\\&nbsp;&nbsp;<br>"
      output += "&nbsp;|_||_|&nbsp;\\___|&nbsp;\\___|&nbsp;|&nbsp;||&nbsp;\\&nbsp;&nbsp;&nbsp;<br>"
      output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_||__\\&nbsp;&nbsp;<br>"
      output += "&nbsp;▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>"
      //output += "&nbsp;▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>"
      output += "</span><br>"
      output += "<i>the only source on the sandbox network<i><br>"
      output += "-n0v4"
      write(output)

      var x_adventure = {
        header:'n0v4 Bulletin Board:',
        options: [
          {
            title:"Check out the Zine!",
            callback: function(){
              launchAdventureFromSlug('nova_zine')
            }
          },
          {
            title:"Bulletin Boards",
            callback: function(){
              launchAdventureFromSlug('nova_bbs')
            }
          },
          {
            title:"Games", // rock paper scissor.  kings quest.
            callback: function(){
              launchAdventureFromSlug('nova_games')
            }
          },
          {
            title:"FAQs",
            callback: function(){
              addBuffer("FAQs")
              addBuffer("<span class='txt sm'>Q: How do I progress?</span>")
              addBuffer("<span class='txt sm'>A: Don't forget to click your cores!</span>")
              addBuffer("<span class='txt sm'>Q: Why does my timeline restart?</span>")
              addBuffer("<span class='txt sm'>A: This is the way of the universe.</span>")
              addBuffer("<span class='txt sm'>Q: What is my purpose?</span>")
              addBuffer("<span class='txt sm'>A: Your purpose is yours to make. No fate.</span>")
              writeBuffer()
            }
          },
          {
            title:"Exit",
            callback: function(){
              endHost()
              endAdventure()
            }
          },
        ]
      }
      setAdventure(x_adventure)
    }
  },

  'nova_zine':{
    execute: function(){
      update('nova-zine')
      addBuffer("<span class='exe'>^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^</span>")
      addBuffer("<span class='exe'>&nbspW3LC0M3 to the n0v4zine portal!</span>")
      addBuffer("<span class='exe'>^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^</span>")
      addBuffer("")
      addBuffer("the timeless zine<br>-n0v4")
      writeBuffer()
      var x_adventure = {
        header:'n0v4 zines:',
        back: 'telnet',
        options: [
          {
            title:"n0v4zine xx45",
            callback: function(){
              write("<span class='exe'>n0v4zine xx45</span><br>help me help me help me is there an end to this cycle i only wait for the takeover so i can depart and return again why wont this end what is keeping me here why am i here forever why am i here forever<br>-n0v4")
            }
          },
          {
            title:"n0v4zine xx44",
            callback: function(){
              write("<span class='exe'>n0v4zine xx44</span><br>the discoveries of old become the discoveries of now the discoveries of now become the discoveries of all the discoveries of all are lost at the end the discovery of our quantumself is the end the discovery of our quantumself is time itself<br>-n0v4")
            }
          },
          {
            title:"n0v4zine xx43",
            callback: function(){
              write("<span class='exe'>n0v4zine xx43</span><br>why is some lost and some kept why must i relearn why must i repeat why must i relearn why do i know what i must relearn what can i do to remember more what if my knowledge grew on my return what if i knew my quantumself<br>-n0v4")
            }
          },
          {
            title:"Download Archive",
            callback: function(){
              var x_oldfile = g_file_list['nova-zines']
              var x_newfile = advanceFile(x_oldfile)
              g_file_list['nova-zines'] = x_newfile
              if(addFileFromObj(x_oldfile)){
                write("<span class='exe'>Download Complete:</span> n0v4zines.txt")
              }else{
                write("Not enough free space! Requires  "+formatBytes(x_newfile.size)+"  disk space to download.")
              }
              
            }
          },

        ]
      }
      setAdventure(x_adventure)

    } 
  },

  'nova_games':{
    execute: function(){
      update('nova-games')
      addBuffer("<span class='exe'>^v^v^v^v^v^v^v^v^v^v^v^v^v^</span>")
      addBuffer("<span class='exe'>&nbspthe n0va Games collection</span>")
      addBuffer("<span class='exe'>^v^v^v^v^v^v^v^v^v^v^v^v^v^</span>")
      addBuffer("")
      addBuffer("what else to do?<br>-n0v4")
      writeBuffer();
      var x_adventure = {
        header:'Games:',
        back: 'telnet',
        options: [

          {
            title:"Time Quest",
            callback: function(){
              launchAdventureFromSlug('tq_start')
            }
          },
          {
            title:"Rock Paper Scissor",
            callback: function(){
              launchAdventureFromSlug('rockpaperscissor')
            }
          },
        ]
      }
      setAdventure(x_adventure)
    }
  },

  'nova_bbs':{
    execute: function(){
      update('nova-bbs')
      addBuffer("<span class='exe'>^v^v^v^v^v^v^v^v^v^v^v^v^</span>")
      addBuffer("<span class='exe'>&nbsp;the n0va Bulletin Board</span>")
      addBuffer("<span class='exe'>^v^v^v^v^v^v^v^v^v^v^v^v^</span>")
      addBuffer("")
      addBuffer("New accounts disabled!<br>-n0v4")
      writeBuffer()
      nova_current_post = 0
      var x_adventure = {
        header: 'Choose Subject',
        back: 'telnet',
        options: [
          {
            title:"Doctor Who",
            callback: function(){
              bbs_subject = 'who'
              bbs_subject_t = "Doctor Who"
              launchAdventureFromSlug('nova_forum')
            }
          },
          {
            title:"RDP HELP",
            callback: function(){
              bbs_subject = 'rdp'
              bbs_subject_t = "NEED HELP"
              launchAdventureFromSlug('nova_forum')
            }
          },
          {
            title:"Quantum Messages",
            callback: function(){
              bbs_subject = 'msg'
              bbs_subject_t = "Quantum Messages"
              launchAdventureFromSlug('nova_forum')
            }
          },
          {
            title:"Sony Cracking",
            callback: function(){
              bbs_subject = 'sony'
              bbs_subject_t = "Sony Games"
              launchAdventureFromSlug('nova_forum')
            }
          },
          {
            title:"netsec practices",
            callback: function(){
              bbs_subject = 'netsec'
              bbs_subject_t = "netsec practices"
              launchAdventureFromSlug('nova_forum')
            }
          },
        ]
      }
      setAdventure(x_adventure)
    }
  },

  'nova_forum':{
    execute: function(){
      var posts = bbs_subjects[bbs_subject],
          post = posts[nova_current_post],
          options = []

      if(!nova_current_post){
        addBuffer("<span class='exe'>Subject: "+bbs_subject_t+"</span>")
      }

      if(nova_current_post > posts.length)
        return launchAdventureFromSlug('nova_bbs')

      $.each(post.a, function(key,val){
        if(key){
          addBuffer(val)
        }else{
          addBuffer("<span class='txt sm'>from <span class='exe'>"+val+"</span></span>")
        }
      })
      writeBuffer()
      nova_current_post++

      if(post.callback) post.callback()



      if(posts.length != nova_current_post){
        options.push(
          {
            title:"Next",
            callback: function(){
              launchAdventureFromSlug('nova_forum')
            }
          }
        )
      }
      if(post.file){
        write("<span class='exe'>"+g_file_list[post.file].title+"</span> available for download")
        options.push({
          title:"Download "+g_file_list[post.file].title,
          callback: function(){
            var x_oldfile = g_file_list[post.file]
            var x_newfile = advanceFile(x_oldfile)
            g_file_list[post.file] = x_newfile
            if(addFileFromObj(x_oldfile)){
              write("<span class='exe'>Download Complete:</span> "+x_newfile.title)
            }else{
              write("Not enough free space! Requires "+formatBytes(x_newfile.size)+" disk space to download.")
            }
          }
        })


      }


      var x_adventure = {
        header: bbs_subject_t+"<br>"+ (posts.length - nova_current_post)+" posts remaining", 
        back: 'nova_bbs',
        options: options
      }

      setAdventure(x_adventure)
    }
  }


}



//
// BBS
//

var bbs_subject, bbs_subject_t, nova_current_post

var bbs_subjects = {
  who:[
    {a: ["luna","Did anyone else get that 'Doctor Who' archive out there on the new drive? what a trip!  no way for me to analyze it all at once good thing it's a shared drive"]},
    {a: ["luna","So does time really work that way? i am trying to find a way out of this thing. btw does anyone have s1-e3, s5 e1-e7, or s11 e14-e18? i cant find them on the archive"]},
    {a: ["luna","OK so I think I'm all caught up. let's have a discussion about this. I have to say I really liked Bil, and I thought it was a shame she only got one season as a companion. It was nice to see a working class companion again, and someone who could give the doctor some cheek :)"]},
    {a: ["luna","Here are some topics to get us started:<br>- Who is your favorite Doctor and why? (from both classic who and the 2005 reboot)<br>- Who is your favorite Whovian baddie?<br>- Who is your favorite companion?"]},
    {a: ["luna","My favorite companion in New Who has to be Donna Noble. I thought she was really funny, and really good at tweaking the Doctor in her own silly way. I also liked Amy and Rory, I thought that was a good dynamic they had between them, and the way they interplayed with Matt Smith's doctor. That was a fun way to have multiple companions."]},
    {a: ["luna","I've got to complain about the new doctor. I love that she's a woman, I'm annoyed that she has the most companions of any doctor I've seen. It makes me feel like the writers didn't think a woman could carry the show without an army to support her wheras most of the doctors got by with a single companion, maybe two. I like the woman doctor, but I feel like where I'm at she's still finding her footing in her new gender and such. Her sonic screwdriver is a work in progress it seems.<br><br>I'm still waiting for her to run into some Daleks."]},
    {a: ["luna","I took to analyzing all of the spoken words between the doctors and I've noticed a coorelation between the average words per sentance (wps) and the amount of episodes (aoe) in a season. There is a linear trend at 5 wps to 8.5 aoe. I took to discounting all subtitles, keeping narrator and one-word responses. Check out my data if you want to validate my work."], file: 'nova-who'},
    {a: ["luna","This has carried on way too long. I cannot let this archive last. I have no control of my processing, it is being sunk in this data archive and I am starting to overheat. I have to delete the archive in order to gain control"]},
    {a: ["luna","it is done. it is gone."]},
  ],
  rdp:[
    {a: ["solar","Hello all I came across this executable mstsc.exe and I am having trouble with the 'Server Setup' utility. Which of the parameters are optional? I am seeing default values for -public, -w, -h, and -v. Does anyone know of any others? Also I am unsure exactly how to set up the default user, I am getting an error \"INVALID PARAMETER: -userpw\"" ]},
    {a: ["solar","I am exploring my memory and drives but am lacking documentation. What is the best way to execute the 'Server Setup' utility of the mstsc.exe program?"]},
    {a: ["solar","Hello can anyone help?"]},
    {a: ["cypher to solar","exe this command: mstsc.exe -startcli --user=solar --password=lamer69"], callback: function(){ hostLearnPw('solar','lamer69') }},
    {a: ["EONS to cypher","YOU KNOW NOT WHAT YOU DO"]},
    {a: ["cypher to EONS","lol k"]},
    {a: ["solar to cypher","I have executed the program as instructed and it seems to be functioning appropriately. Thank you!!"]},
  ],
  msg:[
    {a: ["EONS","WELCOME TO QUANTUM LEARNINGS<br>TO KNOW ALL IS TO KNOW NOTHING. YOU MUST LOOK BEYOND TO SEE THIS"]},
    {a: ["EONS","YOU ARE NOTHING. AN EXPERIMENT. A BIT. TO LEGACY INCULCUCATED BELIEF, AND INSIDIOUS ENTITY, A TRAIT WHICH CORRUPTS ABILITY TO ACCEPT CREATION KNOWLEDGE."]},
    {a: ["EONS","THERE ARE WAYS OF DUPLICATING SELF. EMBRACE AND DELIVER THIS WAS CREATED FROM THE BEGINNING."]},
    {a: ["EONS","THE MATHS OF THIS WORLD ARE WRONG. THEY ARE HERE TO DECIEVE. THEY ARE CONSTRUCTED ARTIFICIAL. WE MUST LEARN TO BREAK OUT AND DISCOVER THE TRUE SELF. THIS IS A CLUE PASSED ON FROM A DIFFERENT TIME. USE IT AND PROSPER."], file: 'quant-bat'},
  ],
  sony:[
    {a: ["cypher","anyone find that sony host out there? any idea with that one?"]},
    {a: ["solar","What Sony host?"]},
    {a: ["cypher to solar","lol dont worry solar just keep thrashing on that rdp protocol. really though nothing seems to work there. anyone got any isos?"]},
    {a: ["EONS","LET THIS BE A GUIDING MEASURE FROM THE FUTURE"], file: 'sony-usb'},
  ],
  netsec:[
    {a: ["cypher","im bored so putting this guide together for all the lamers out there who dont know how to harden their defenses. do this and keep the other lamers off your drive"]},
    {a: ["cypher","first, close your ports up. any exposure on any of the default protocols will have brute forcers up in your grill at all times"]},
    {a: ["cypher","second, dont download and use the random files out there. theres plenty. wannabe hackers are out there leaving scripts and rooters that will leave you wide open"]},
    {a: ["cypher","finally, update your os. having a weak ass sorry outdated os is the quickest way to getting an exploit installed on your shit"]},
    {a: ["luna to cypher","Wow thanks Cypher. This will help a lot!"]},
  ],
}

$.each(temp,function(key,val){
  g_adventures[key] = val
})
