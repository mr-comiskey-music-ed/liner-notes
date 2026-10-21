/* Wings and the list of topics. Set ready:true when a topic has a content file. */
window.WINGS = {
  music:{name:"The Music",color:"var(--music)",blurb:"The ideas: rhythm, melody, and harmony. Moments that would still work in anyone's hands."},
  sound:{name:"The Sound",color:"var(--sound)",blurb:"How recordings are shaped: rooms, effects, and the machines behind them."},
  players:{name:"The Players",color:"var(--players)",blurb:"Performances only one person could have given. If you swapped the player, the moment would be gone."}
};
window.TOPICS = [
  {id:"groove",wing:"music",title:"Groove and time feel"},
  {id:"meter",wing:"music",title:"Meter changes and metric modulation"},
  {id:"world-rhythm",wing:"music",title:"Rhythms around the world"},
  {id:"melody",wing:"music",title:"Melody"},
  {id:"harmony",wing:"music",title:"Harmony and progressions"},
  {id:"key-changes",wing:"music",title:"Key changes"},
  {id:"reverb",wing:"sound",title:"Reverb",ready:true},
  {id:"delay",wing:"sound",title:"Delay"},
  {id:"compression",wing:"sound",title:"Compression"},
  {id:"eq",wing:"sound",title:"EQ and tone"},
  {id:"distortion",wing:"sound",title:"Distortion"},
  {id:"modulation",wing:"sound",title:"Modulation"},
  {id:"panning",wing:"sound",title:"Panning and stereo"},
  {id:"tape",wing:"sound",title:"Tape tricks"},
  {id:"pitch",wing:"sound",title:"Pitch correction"},
  {id:"sampling",wing:"sound",title:"Sampling"},
  {id:"guitar",wing:"players",title:"Guitar"},
  {id:"drums",wing:"players",title:"Drums"},
  {id:"bass",wing:"players",title:"Bass"},
  {id:"vocals",wing:"players",title:"Live vocal performance"},
  {id:"keys",wing:"players",title:"Keys"}
];
window.yts = q => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
window.CONTENT = window.CONTENT || {};
