/* LINER NOTES CONTENT
   1. Wings and topic list (set ready:true when a topic has cards below)
   2. Topic cards, one block per topic, in wing order

   To set a clip: paste a YouTube link (or the 11-character video ID) into yt:"".
   Optional: start:45, end:70 (seconds) to play just the moment.
   Find any song quickly with Cmd+F. */

/* ===== 1. WINGS AND TOPICS ===== */
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

/* ===== 2. TOPIC CARDS ===== */

/* ----- THE SOUND: Reverb ----- */
CONTENT.reverb = {
  intro:"Reverb is the sound of a space: the reflections that keep ringing after a note. Every recording either borrows a real room, builds a fake one, or leaves the room out on purpose. These eight moments show how that choice changes what you feel.",
  entries:[
   {id:"natural",name:"The room as instrument",badges:["Iconic","Innovative"],
    clips:[{song:"When the Levee Breaks",artist:"Led Zeppelin",year:1971,yt:"",q:"Led Zeppelin When the Levee Breaks remaster"}],
    bullets:["John Bonham's kit was set up at the bottom of a three-story stairwell in Headley Grange, an old house in England, with two mics hung near the top.",
             "The stairwell is the reverb. Every hit blooms up the stairs before it reaches the mics.",
             "Jimmy Page slowed the tape slightly in the mix, which made the drums even heavier. The intro became one of hip-hop's most sampled breaks."],
    credits:"Engineer: Andy Johns · Headley Grange, Hampshire",
    links:[{rel:"Influenced",text:"Beastie Boys, \"Rhymin & Stealin'\" (1986), built on the sampled beat"}]},
   {id:"chambers",name:"Echo chambers",badges:["Iconic"],
    clips:[{label:"Capitol",song:"Only the Lonely",artist:"Frank Sinatra",year:1958,yt:"",q:"Frank Sinatra Only the Lonely 1958"},
           {label:"Motown",song:"My Girl",artist:"The Temptations",year:1964,yt:"",q:"The Temptations My Girl"}],
    bullets:["Before reverb boxes existed, studios built rooms just for echo. A speaker plays the track into a hard-walled room, and mics send the reflections back to the mix.",
             "Capitol's chambers are concrete rooms about 30 feet under the parking lot. Les Paul designed the first four in 1956.",
             "Motown's was the attic of its Detroit house, built out by Berry Gordy's father. Listen for it on the finger snaps in \"My Girl.\""],
    credits:"Capitol Studios, Hollywood · Hitsville U.S.A., Detroit",links:[]},
   {id:"wall",name:"The Wall of Sound",badges:["Iconic","Innovative"],
    clips:[{song:"Be My Baby",artist:"The Ronettes",year:1963,yt:"jSPpbOGnFgk",q:"The Ronettes Be My Baby"}],
    bullets:["Pianos, guitars, percussion, and strings were stacked, then sent through Gold Star's echo chambers until the parts melted into one roar.",
             "Studio co-owner David Gold designed those chambers himself and even mixed his own coating for the walls.",
             "Brian Wilson was obsessed with this record and answered it with \"Don't Worry Baby.\""],
    credits:"Producer: Phil Spector · Engineer: Larry Levine · Gold Star Studios, Los Angeles",
    links:[{rel:"Influenced",text:"The Beach Boys, \"Don't Worry Baby\" (1964)"}]},
   {id:"spring",name:"Spring reverb",badges:["Genre-defining"],
    clips:[{song:"Misirlou",artist:"Dick Dale & His Del-Tones",year:1962,yt:"",q:"Dick Dale Misirlou 1962"}],
    bullets:["A spring reverb sends the signal down a coiled metal spring. The bouncing makes a wet, splashy \"drip.\"",
             "Fender's standalone Reverb Unit came out in 1961, small enough to sit on top of an amp, and surf guitarists made it their signature sound.",
             "Dale built his version from a melody he heard his Lebanese-American relatives play on the oud."],
    credits:"Fender Reverb Unit (6G15), 1961",links:[]},
   {id:"plate",name:"Plate reverb",badges:["Innovative"],
    clips:[{label:"Example to choose",song:"EMT 140 demo",artist:"",year:"",yt:"",q:"EMT 140 plate reverb demo"}],
    bullets:["A thin steel sheet, about 8 by 4 feet, hangs on springs inside a big box. A driver shakes it, and contact mics pick up the shimmer.",
             "The EMT 140 (1957) was the first plate reverb. It was far cheaper than building a chamber, and its sound is smooth and dense.",
             "Abbey Road installed four, heard on Beatles and Pink Floyd records. It's still a favorite on vocals."],
    credits:"EMT 140 · Germany, 1957",links:[]},
   {id:"gated",name:"Gated reverb",badges:["Iconic","Innovative"],
    clips:[{song:"In the Air Tonight",artist:"Phil Collins",year:1981,yt:"",q:"Phil Collins In the Air Tonight official"},
           {song:"Intruder",artist:"Peter Gabriel",year:1980,yt:"",q:"Peter Gabriel Intruder"}],
    bullets:["A new mixing desk at London's Townhouse Studios had a heavily compressed \"listen mic\" for hearing the band. Collins played drums through it, and the room exploded.",
             "A noise gate cuts the reverb off dead, so each hit sounds enormous but stops short.",
             "It was first heard on Peter Gabriel's \"Intruder.\" A year later, Collins and engineer Hugh Padgham rebuilt it for his own record, and it defined '80s drums."],
    credits:"Engineer and co-producer: Hugh Padgham · The Townhouse, London",
    links:[{rel:"Influenced by",text:"Peter Gabriel, \"Intruder\" (1980)"},{rel:"Influenced",text:"Prince, \"Kiss\" (1986), and much of '80s pop"}]},
   {id:"atmosphere",name:"Reverb as atmosphere",badges:["Genre-defining"],
    clips:[{song:"Heaven or Las Vegas",artist:"Cocteau Twins",year:1990,yt:"",q:"Cocteau Twins Heaven or Las Vegas"}],
    bullets:["Robin Guthrie ran his guitars through long reverbs and chorus until the instruments blur into a cloud.",
             "He has described himself as playing the reverb as much as the guitar.",
             "The band is credited as a pioneer of dream pop, and shoegaze bands like My Bloody Valentine named them as an influence."],
    credits:"Cocteau Twins · 4AD",links:[{rel:"Influenced",text:"Shoegaze and dream pop, from the '90s to now"}]},
   {id:"dry",name:"The dry era",badges:["Popular","Innovative"],
    clips:[{song:"bad guy",artist:"Billie Eilish",year:2019,yt:"",q:"Billie Eilish bad guy"}],
    bullets:["There's almost no reverb on the vocal. Finneas said they wanted it to feel like you were sitting right next to Billie.",
             "The album was made in his bedroom, which had no reverb, so they kept that sound. When the mixer added reverb to an early mix, they told him to take it out.",
             "Reverb puts a sound in a space. Taking it away puts the singer in your ear."],
    credits:"Producer: Finneas O'Connell · Mix: Rob Kinelski",links:[]}
  ],
  prompts:[
   {id:"feel",text:"Pick one entry. How does the space in that recording change the way the music feels to you?"},
   {id:"compare",text:"Compare \"The dry era\" with one of the big-reverb entries. Where does each one put the singer or player, close to you or far away? Which do you prefer, and why?"},
   {id:"context",text:"Choose one entry and explain why it mattered when it came out. What was new about it?"},
   {id:"space",text:"Many of these spaces were real places: a stairwell, an attic, a concrete bunker. If you could record in any real space you know, where would it be, and what would you record there?"},
   {id:"own",text:"Your own angle. Write about anything on this page that caught your ear."}
  ]
 };
