

// LOGS


g_fadeincount = 0
write = function(txt){
  var mylog = g_fadeincount++
  $("#writelog").append("<div id='fadein-"+mylog+"'></div><br>") 
  var $newdiv = $("#fadein-"+mylog)
  $newdiv.hide().html(txt).fadeIn({duration:g_fadespeed,queue:true})
  $('#writelog').stop().animate({scrollTop: $('#writelog').prop("scrollHeight")}, g_fadespeed);
}

log = function(txt){console.log( txt );}

glitch = function(txt){
  return "<span class='glitch' data-text='"+txt+"'>"+txt+"</span>"
}



// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function formatBytes(a, add_space = false, units = 1){
  if(0==a)return"0";var c=1000,d=units,e=["","k","M","G","t","p","e","z","y"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+(add_space?" ":"")+e[f]
}


// https://stackoverflow.com/questions/2998784/how-to-output-numbers-with-leading-zeros-in-javascript
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}