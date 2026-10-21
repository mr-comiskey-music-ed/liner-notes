const {WINGS,TOPICS,CONTENT,yts}=window;
/* ---------- storage ---------- */
const store = {
  get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
};
let responses = store.get("ln.responses",[]);
let assignment = store.get("ln.assignment",null);
const saveResponses = () => store.set("ln.responses",responses);

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const topicById = id => TOPICS.find(t=>t.id===id);
const words = s => (s.trim().match(/\S+/g)||[]).length;
const ytId = s => {
  if(!s) return "";
  s=s.trim();
  if(/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
  return m?m[1]:"";
};
function b64u(bytes){let s="";bytes.forEach(b=>s+=String.fromCharCode(b));return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function unb64u(str){str=str.replace(/-/g,"+").replace(/_/g,"/");while(str.length%4)str+="=";const s=atob(str);return Uint8Array.from(s,c=>c.charCodeAt(0))}
async function pack(prefix,obj){
  const raw=new TextEncoder().encode(JSON.stringify(obj));
  if(window.CompressionStream){
    const out=await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream("deflate-raw"))).arrayBuffer();
    return prefix+"z."+b64u(new Uint8Array(out));
  }
  return prefix+"."+b64u(raw);
}
async function unpack(prefix,code){
  code=code.trim();
  if(!code.startsWith(prefix)) throw new Error("prefix");
  const rest=code.slice(prefix.length);
  let bytes;
  if(rest.startsWith("z.")){
    const out=await new Response(new Blob([unb64u(rest.slice(2))]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer();
    bytes=new Uint8Array(out);
  } else bytes=unb64u(rest.slice(1));
  return JSON.parse(new TextDecoder().decode(bytes));
}
async function copyText(text,el){
  try{await navigator.clipboard.writeText(text);return true}
  catch(e){if(el){el.focus();el.select()}return false}
}

/* ---------- assignment logic ---------- */
function allowedTopics(a){
  if(!a) return TOPICS.map(t=>t.id);
  if(a.m==="p") return a.t;
  if(a.t && a.t.length) return a.t;
  if(a.w) return TOPICS.filter(t=>t.wing===a.w).map(t=>t.id);
  return TOPICS.map(t=>t.id);
}
function required(a){return a.m==="p"?a.t.length:a.n}
function describe(a){
  if(!a) return "";
  const names=ids=>ids.map(id=>topicById(id)?.title||id).join(", ");
  if(a.m==="p") return "Explore: "+names(a.t);
  if(a.t && a.t.length) return `Explore any ${a.n} of: ${names(a.t)}`;
  if(a.w) return `Explore any ${a.n} topics from ${WINGS[a.w].name}`;
  return `Explore any ${a.n} topics`;
}
function progress(a,resps){
  const ok=new Set(allowedTopics(a));
  const done=[...new Set(resps.filter(r=>ok.has(r.t)&&r.txt.trim()).map(r=>r.t))];
  return {done,need:required(a)};
}
function renderAssignBar(){
  const bar=$("#assignBar");
  if(!assignment){bar.hidden=true;bar.innerHTML="";return}
  const {done,need}=progress(assignment,responses);
  const n=Math.min(done.length,need);
  bar.hidden=false;bar.className="assign";
  bar.innerHTML=`<strong>${esc(assignment.title||"Assignment")}</strong>
    <span class="muted">${esc(describe(assignment))}</span>
    <span class="meter" aria-hidden="true">${Array.from({length:need},(_,i)=>`<i class="${i<n?"on":""}"></i>`).join("")}</span>
    <span class="mono">${n} of ${need} done</span>
    <a href="#responses" style="margin-left:auto">Make my code</a>`;
}

/* ---------- views ---------- */
function viewHome(){
  return `<section class="hero">
    <h1>Liner Notes</h1>
    <div class="sub mono muted">The Music · The Sound · The Players</div>
    <p>Great moments in recorded music, one short clip at a time. Listen closely, read the notes, and write about what you hear.</p>
  </section>
  <div class="wings">${Object.entries(WINGS).map(([k,w])=>wingCard(k,w)).join("")}</div>`;
}
function wingCard(k,w){
  const ts=TOPICS.filter(t=>t.wing===k);
  return `<a class="wing" href="#${k}">
    <span class="label" style="background:${w.color}">${ts.length} topics</span>
    <h2>${w.name}</h2><p>${w.blurb}</p>
    <div class="chips">${ts.map(t=>`<span class="chip ${t.ready?"ready":""}">${esc(t.title)}</span>`).join("")}</div></a>`;
}
function viewWing(k){
  const w=WINGS[k];const ts=TOPICS.filter(t=>t.wing===k);
  return `<section class="topic-head"><span class="mono" style="color:${w.color}">Wing</span><h1>${w.name}</h1><p>${w.blurb}</p></section>
  <div class="grid2" style="margin-top:20px">${ts.map((t,i)=>`
    <${t.ready?`a href="#${t.id}"`:"div"} class="resp" style="text-decoration:none">
      <span class="mono muted">Side ${k==="music"?"A":k==="sound"?"B":"C"} · ${String(i+1).padStart(2,"0")}</span>
      <strong style="font-family:var(--display);font-size:20px">${esc(t.title)}</strong>
      <span class="muted" style="font-size:14px">${t.ready?"8 moments · open":"Coming soon"}</span>
    </${t.ready?"a":"div"}>`).join("")}</div>`;
}
function clipHTML(entryId,clip){
  const id=ytId(clip.yt);
  const who=[clip.artist,clip.year].filter(Boolean).join(", ");
  const watch=id?`https://www.youtube.com/watch?v=${id}${clip.start?`&t=${clip.start}s`:""}`:yts(clip.q);
  const face=id
    ? `<button class="video" type="button" data-play="${id}" data-start="${clip.start||""}" data-end="${clip.end||""}" aria-label="Play ${esc(clip.song)}">
         <img alt="" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" onerror="this.remove()">
         <span class="play" aria-hidden="true">▶</span></button>`
    : `<div class="video" role="img" aria-label="Clip not chosen yet"><span class="note">Clip not chosen yet.<br>Paste a YouTube link into this entry's data.</span></div>`;
  return `<div data-clipwrap>${face}
    <div class="cliplinks"><span>${esc(clip.song)}${who?` · ${esc(who)}`:""}</span>
    <a href="${watch}" target="_blank" rel="noopener">${id?"Can't play? Open on YouTube":"Find on YouTube"}</a></div></div>`;
}
function viewTopic(tid){
  const t=topicById(tid),c=CONTENT[tid];
  const mine=responses.filter(r=>r.t===tid);
  return `<section class="topic-head">
    <a href="#${t.wing}" class="mono" style="color:${WINGS[t.wing].color};text-decoration:none">${WINGS[t.wing].name}</a>
    <h1>${esc(t.title)}</h1><p>${esc(c.intro)}</p></section>
  <p class="swipehint">Swipe sideways for all ${c.entries.length} moments.</p>
  <div class="cards">${c.entries.map((e,i)=>`
    <article class="card" id="e-${e.id}">
      <div class="eyebrow mono"><span>${String(i+1).padStart(2,"0")} / ${String(c.entries.length).padStart(2,"0")}</span><span>${e.clips[0].year||""}</span></div>
      <h2>${esc(e.name)}</h2>
      ${e.clips.length>1?`<div class="tabs" role="group" aria-label="Clips">${e.clips.map((cl,j)=>`<button type="button" data-tab="${e.id}" data-i="${j}" aria-pressed="${j===0}">${esc(cl.label||cl.song)}</button>`).join("")}</div>`:""}
      <div data-clips="${e.id}">${clipHTML(e.id,e.clips[0])}</div>
      <div class="badges">${e.badges.map((b,j)=>`<span class="badge ${j===1?"alt":j===2?"alt2":""}">${esc(b)}</span>`).join("")}</div>
      <ul>${e.bullets.map(b=>`<li>${esc(b)}</li>`).join("")}</ul>
      <div class="credits mono">${esc(e.credits)}${e.links.map(l=>`<span>${esc(l.rel)}: ${esc(l.text)}</span>`).join("")}</div>
    </article>`).join("")}</div>

  <section class="section" aria-labelledby="refl">
    <h2 id="refl">Your reflection</h2>
    <p class="muted" style="margin:0">Choose a prompt, write your response, and save it. Saved responses go into your code on the My responses page.</p>
    <div class="prompts" id="promptList">${c.prompts.map((p,i)=>`
      <label class="prompt ${i===0?"sel":""}"><input type="radio" name="prompt" value="${p.id}" ${i===0?"checked":""}><span>${esc(p.text)}</span></label>`).join("")}</div>
    <div class="grid2">
      <div class="field"><label for="aboutSel">Which moment is this about? (optional)</label>
        <select id="aboutSel"><option value="">Not one in particular</option>${c.entries.map(e=>`<option value="${e.id}">${esc(e.name)}</option>`).join("")}</select></div>
    </div>
    <div class="field"><label for="respText">Your response</label><textarea id="respText" placeholder="When the drums come in on the stairwell recording, it feels like…"></textarea>
      <span class="mono muted" id="wc">0 words</span></div>
    <div class="row"><button class="primary" id="saveResp" type="button">Save response</button><span class="toast" id="saveMsg" role="status"></span></div>
    ${mine.length?`<div class="mono muted">You have ${mine.length} saved response${mine.length>1?"s":""} on this topic.</div>`:""}
  </section>

  <section class="section" aria-labelledby="sugg">
    <h2 id="sugg">Suggest your own</h2>
    <p class="muted" style="margin:0">Know a great ${esc(t.title.toLowerCase())} moment that belongs here? Send a YouTube link. Mr. Comiskey reviews every suggestion before it appears. No names are collected.</p>
    <div class="grid2">
      <div class="field"><label for="sgLink">YouTube link</label><input id="sgLink" inputmode="url" placeholder="https://www.youtube.com/watch?v=…"></div>
      <div class="field"><label for="sgWhy">Why it belongs (one line)</label><input id="sgWhy" maxlength="140" placeholder="Huge cathedral reverb on the choir"></div>
    </div>
    <div class="row"><button id="sgSend" type="button">Send suggestion</button><span id="sgMsg" role="status"></span></div>
    <div class="field"><strong>Approved suggestions</strong><div class="empty">Approved suggestions will show up here, with a count of how many people suggested each one.</div></div>
  </section>`;
}
function viewResponses(){
  const groups={};responses.forEach(r=>(groups[r.t]=groups[r.t]||[]).push(r));
  return `<section class="topic-head"><span class="mono muted">Your work</span><h1>My responses</h1>
    <p>Everything you've saved lives in this browser only. When you're ready to turn it in, make your code and paste it into Google Classroom.</p></section>
  <section class="section">
    <h2>Assignment</h2>
    ${assignment?`<div class="resp"><strong>${esc(assignment.title||"Assignment")}</strong><span class="muted">${esc(describe(assignment))}</span>
       <div class="row"><button type="button" id="clearAssign">Remove assignment</button></div></div>`
      :`<div class="field"><label for="assignIn">Paste an assignment code from your teacher</label>
       <div class="row"><input id="assignIn" style="flex:1;min-width:0" placeholder="LNA…"><button type="button" id="assignGo">Start assignment</button></div><span class="err" id="assignErr"></span></div>`}
  </section>
  <section class="section">
    <h2>Saved responses</h2>
    ${responses.length?Object.entries(groups).map(([tid,rs])=>`
      <div class="field"><strong style="font-family:var(--display);font-size:20px">${esc(topicById(tid)?.title||tid)}</strong>
      ${rs.map(r=>`<div class="resp"><span class="mono muted">${esc(promptText(r.t,r.p))}${r.e?` · ${esc(entryName(r.t,r.e))}`:""}</span><p>${esc(r.txt)}</p>
        <div class="row"><span class="mono muted">${words(r.txt)} words</span><button type="button" data-del="${r.id}" style="margin-left:auto">Delete</button></div></div>`).join("")}</div>`).join("")
      :`<div class="empty">No responses yet. Open a topic, like <a href="#reverb">Reverb</a>, and write one.</div>`}
  </section>
  <section class="section">
    <h2>Turn it in</h2>
    <div class="row"><button class="primary" id="makeCode" type="button" ${responses.length?"":"disabled"}>Make my code</button><button id="copyCode" type="button" hidden>Copy code</button><span class="toast" id="codeMsg" role="status"></span></div>
    <textarea class="code" id="codeOut" readonly hidden aria-label="Your code"></textarea>
    <details><summary>Switching Chromebooks or lost your work? Restore from a code</summary>
      <div class="field" style="margin-top:10px"><label for="restoreIn">Paste a code you made earlier</label><textarea class="code" id="restoreIn"></textarea>
      <div class="row"><button type="button" id="restoreGo">Restore</button><span id="restoreMsg" role="status"></span></div></div></details>
  </section>`;
}
function promptText(tid,pid){return CONTENT[tid]?.prompts.find(p=>p.id===pid)?.text||pid}
function entryName(tid,eid){return CONTENT[tid]?.entries.find(e=>e.id===eid)?.name||eid}

function viewTeacher(){
  return `<section class="topic-head"><span class="mono muted">Teacher tools</span><h1>Assignments and grading</h1>
    <p>Build an assignment code to post in Google Classroom, then paste your class's codes here to read their work.</p></section>
  <section class="section">
    <h2>Build an assignment</h2>
    <div class="grid2">
      <div class="field"><label for="aTitle">Title</label><input id="aTitle" value="Reverb listening"></div>
      <div class="field"><label for="aMode">Type</label><select id="aMode"><option value="p">Prescribed: these exact topics</option><option value="c">Choice: any number they pick</option></select></div>
    </div>
    <div class="grid2" id="choiceOpts" hidden>
      <div class="field"><label for="aN">How many topics</label><input id="aN" type="number" min="1" max="20" value="3"></div>
      <div class="field"><label for="aWing">Limit to a wing</label><select id="aWing"><option value="">Any wing</option>${Object.entries(WINGS).map(([k,w])=>`<option value="${k}">${w.name}</option>`).join("")}</select></div>
    </div>
    <fieldset class="field" style="border:1px solid var(--rule);border-radius:10px;padding:12px"><legend class="muted" id="topicLegend">Topics students must complete</legend>
      <div class="grid2">${TOPICS.map(t=>`<label style="font-weight:400;display:flex;gap:8px;align-items:center"><input type="checkbox" value="${t.id}" style="width:auto" ${t.id==="reverb"?"checked":""}> ${esc(t.title)} <span class="mono muted">${WINGS[t.wing].name.replace("The ","")}</span></label>`).join("")}</div></fieldset>
    <div class="row"><button class="primary" id="aMake" type="button">Make assignment code</button><span class="err" id="aErr"></span></div>
    <div id="aOut" hidden class="field"><label for="aCode">Assignment code (students paste this on My responses)</label><textarea class="code" id="aCode" readonly></textarea>
      <label for="aLink">Or share this link once the site is live</label><input id="aLink" readonly class="code" style="min-height:0">
      <div class="row"><button type="button" id="aCopy">Copy code</button><button type="button" id="aCopyLink">Copy link</button><span class="toast" id="aMsg"></span></div></div>
  </section>
  <section class="section">
    <h2>Grade a class</h2>
    <div class="field"><label for="gIn">Paste student codes, one per line</label><textarea class="code" id="gIn" placeholder="LN1z.…"></textarea></div>
    <div class="row"><button class="primary" id="gGo" type="button">Read codes</button><span class="err" id="gErr"></span></div>
    <div id="gOut"></div>
  </section>`;
}

/* ---------- router ---------- */
function route(){
  const h=(location.hash||"#home").slice(1);
  let html,key=h;
  if(WINGS[h]) html=viewWing(h);
  else if(CONTENT[h]) {html=viewTopic(h);key=topicById(h).wing}
  else if(h==="responses") html=viewResponses();
  else if(h==="teacher") html=viewTeacher();
  else {html=viewHome();key="home"}
  $("#view").innerHTML=html;
  document.querySelectorAll("[data-nav]").forEach(a=>{if(a.dataset.nav===key)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
  renderAssignBar();
  if(CONTENT[h]) bindTopic(h);
  if(h==="responses") bindResponses();
  if(h==="teacher") bindTeacher();
  window.scrollTo(0,0);
}
window.addEventListener("hashchange",route);

/* ---------- bindings ---------- */
document.addEventListener("click",e=>{
  const play=e.target.closest("[data-play]");
  if(play){
    const p=new URLSearchParams({autoplay:"1",rel:"0"});
    if(play.dataset.start)p.set("start",play.dataset.start);
    if(play.dataset.end)p.set("end",play.dataset.end);
    play.outerHTML=`<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${play.dataset.play}?${p}" title="YouTube clip" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
    return;
  }
  const tab=e.target.closest("[data-tab]");
  if(tab){
    const eid=tab.dataset.tab,tid=(location.hash||"").slice(1);
    const entry=CONTENT[tid].entries.find(x=>x.id===eid);
    tab.parentElement.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b===tab)));
    document.querySelector(`[data-clips="${eid}"]`).innerHTML=clipHTML(eid,entry.clips[+tab.dataset.i]);
  }
});
function bindTopic(tid){
  const list=$("#promptList"),ta=$("#respText"),wc=$("#wc");
  list.addEventListener("change",()=>list.querySelectorAll(".prompt").forEach(l=>l.classList.toggle("sel",l.querySelector("input").checked)));
  const draftKey="ln.draft."+tid;
  ta.value=store.get(draftKey,"");
  const upd=()=>{wc.textContent=words(ta.value)+" words";store.set(draftKey,ta.value);$("#saveMsg").textContent=""};
  ta.addEventListener("input",upd);upd();
  $("#saveResp").addEventListener("click",()=>{
    const msg=$("#saveMsg");
    if(words(ta.value)<5){msg.className="err";msg.textContent="Write at least a sentence before saving.";return}
    responses.push({id:Date.now().toString(36),t:tid,p:list.querySelector("input:checked").value,e:$("#aboutSel").value,txt:ta.value.trim(),at:Date.now()});
    saveResponses();ta.value="";store.set(draftKey,"");wc.textContent="0 words";
    msg.className="toast";msg.textContent="Saved. Write another, or go to My responses to make your code.";
    renderAssignBar();
  });
  $("#sgSend").addEventListener("click",()=>{
    const m=$("#sgMsg");
    if(!ytId($("#sgLink").value)){m.className="err";m.textContent="That doesn't look like a YouTube link. Copy it from the address bar and try again.";return}
    if(!$("#sgWhy").value.trim()){m.className="err";m.textContent="Add one line about why it belongs.";return}
    m.className="toast";m.textContent="Preview only: suggestions will be sent for review once the database is connected.";
    $("#sgLink").value="";$("#sgWhy").value="";
  });
}
function bindResponses(){
  document.querySelectorAll("[data-del]").forEach(b=>b.addEventListener("click",()=>{
    if(b.dataset.armed){responses=responses.filter(r=>r.id!==b.dataset.del);saveResponses();route()}
    else{b.dataset.armed="1";b.textContent="Tap again to delete"}
  }));
  const go=$("#assignGo");
  if(go) go.addEventListener("click",async()=>{
    try{const a=await unpack("LNA",$("#assignIn").value);assignment=a;store.set("ln.assignment",a);route()}
    catch(e){$("#assignErr").textContent="That code didn't work. Check that you copied the whole thing."}
  });
  const cl=$("#clearAssign");
  if(cl) cl.addEventListener("click",()=>{
    if(cl.dataset.armed){assignment=null;store.set("ln.assignment",null);route()}
    else{cl.dataset.armed="1";cl.textContent="Tap again to remove"}
  });
  $("#makeCode").addEventListener("click",async()=>{
    const payload={v:1,a:assignment,r:responses.map(r=>[r.t,r.e||"",r.p,r.txt])};
    const code=await pack("LN1",payload);
    const out=$("#codeOut");out.hidden=false;out.value=code;$("#copyCode").hidden=false;
    $("#codeMsg").textContent="Copy this code and paste it into Google Classroom.";
  });
  $("#copyCode").addEventListener("click",async()=>{
    const ok=await copyText($("#codeOut").value,$("#codeOut"));
    $("#codeMsg").textContent=ok?"Copied.":"Press Ctrl+C to copy the selected code.";
  });
  $("#restoreGo").addEventListener("click",async()=>{
    const m=$("#restoreMsg");
    try{
      const d=await unpack("LN1",$("#restoreIn").value);
      const have=new Set(responses.map(r=>r.t+"|"+r.p+"|"+r.txt));
      let added=0;
      d.r.forEach(([t,e,p,txt],i)=>{if(!have.has(t+"|"+p+"|"+txt)){responses.push({id:Date.now().toString(36)+i,t,e,p,txt,at:Date.now()});added++}});
      if(d.a&&!assignment){assignment=d.a;store.set("ln.assignment",d.a)}
      saveResponses();m.className="toast";m.textContent=`Restored ${added} response${added===1?"":"s"}.`;setTimeout(route,900);
    }catch(e){m.className="err";m.textContent="That code didn't work. Check that you copied the whole thing."}
  });
}
function bindTeacher(){
  const mode=$("#aMode");
  const sync=()=>{const c=mode.value==="c";$("#choiceOpts").hidden=!c;$("#topicLegend").textContent=c?"Optional: limit choices to these topics (leave all unchecked for any)":"Topics students must complete"};
  mode.addEventListener("change",sync);sync();
  $("#aMake").addEventListener("click",async()=>{
    const t=[...document.querySelectorAll("fieldset input:checked")].map(i=>i.value);
    const m=mode.value,err=$("#aErr");err.textContent="";
    const a={id:Math.random().toString(36).slice(2,8),title:$("#aTitle").value.trim()||"Assignment",m,t};
    if(m==="p"&&!t.length){err.textContent="Check at least one topic.";return}
    if(m==="c"){a.n=Math.max(1,parseInt($("#aN").value)||1);a.w=$("#aWing").value||"";
      const pool=allowedTopics(a);if(pool.length<a.n){err.textContent=`Only ${pool.length} topics match. Lower the number or widen the choices.`;return}}
    const code=await pack("LNA",a);
    $("#aOut").hidden=false;$("#aCode").value=code;
    $("#aLink").value=location.origin+location.pathname+"?a="+encodeURIComponent(code);
  });
  $("#aCopy").addEventListener("click",async()=>{$("#aMsg").textContent=(await copyText($("#aCode").value,$("#aCode")))?"Copied.":"Press Ctrl+C to copy."});
  $("#aCopyLink").addEventListener("click",async()=>{$("#aMsg").textContent=(await copyText($("#aLink").value,$("#aLink")))?"Copied.":"Press Ctrl+C to copy."});
  $("#gGo").addEventListener("click",async()=>{
    const lines=$("#gIn").value.split(/\s+/).filter(Boolean);
    const out=$("#gOut"),err=$("#gErr");err.textContent="";
    if(!lines.length){err.textContent="Paste at least one code.";return}
    const rows=[];
    for(let i=0;i<lines.length;i++){
      try{rows.push({n:i+1,d:await unpack("LN1",lines[i])})}catch(e){rows.push({n:i+1,bad:true})}
    }
    out.innerHTML=`<div class="tablewrap"><table><thead><tr><th>#</th><th>Status</th><th>Assignment</th><th>Topics</th><th>Words</th><th></th></tr></thead><tbody>
      ${rows.map(r=>{
        if(r.bad) return `<tr><td>${r.n}</td><td><span class="status short">Unreadable</span></td><td colspan="4" class="muted">Code was cut off or changed.</td></tr>`;
        const resps=r.d.r.map(([t,e,p,txt])=>({t,e,p,txt}));
        const a=r.d.a;let status="",prog="";
        if(a){const pr=progress(a,resps);const ok=pr.done.length>=pr.need;status=`<span class="status ${ok?"ok":"short"}">${ok?"Complete":"Short"}</span>`;prog=`${esc(a.title)} · ${Math.min(pr.done.length,pr.need)}/${pr.need}`}
        else status=`<span class="status ok">Responses</span>`,prog=`<span class="muted">None</span>`;
        const topics=[...new Set(resps.map(x=>topicById(x.t)?.title||x.t))].join(", ");
        const wc=resps.reduce((s,x)=>s+words(x.txt),0);
        return `<tr><td>${r.n}</td><td>${status}</td><td>${prog}</td><td>${esc(topics)}</td><td style="font-variant-numeric:tabular-nums">${wc}</td><td><button type="button" data-view="${r.n}">View</button></td></tr>
          <tr hidden data-detail="${r.n}"><td colspan="6"><div class="field">${resps.map(x=>{
            const ent=CONTENT[x.t]?.entries.find(en=>en.id===x.e);const cl=ent?.clips[0];
            const link=cl?(ytId(cl.yt)?`https://www.youtube.com/watch?v=${ytId(cl.yt)}`:yts(cl.q)):"";
            return `<div class="resp"><span class="mono muted">${esc(topicById(x.t)?.title||x.t)} · ${esc(promptText(x.t,x.p))}</span>
              ${ent?`<span class="mono">About: ${esc(ent.name)} · <a href="${link}" target="_blank" rel="noopener">${esc(cl.song)}</a></span>`:""}
              <p>${esc(x.txt)}</p><span class="mono muted">${words(x.txt)} words</span></div>`}).join("")}</div></td></tr>`;
      }).join("")}</tbody></table></div>`;
    out.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>{const d=out.querySelector(`[data-detail="${b.dataset.view}"]`);d.hidden=!d.hidden;b.textContent=d.hidden?"View":"Hide"}));
  });
}

/* ---------- theme ---------- */
(function(){
  const saved=store.get("ln.theme",null);
  if(saved)document.documentElement.setAttribute("data-theme",saved);
  $("#themeBtn").addEventListener("click",()=>{
    const cur=document.documentElement.getAttribute("data-theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
    const next=cur==="dark"?"light":"dark";
    document.documentElement.setAttribute("data-theme",next);store.set("ln.theme",next);
  });
})();

/* ---------- assignment from link (?a=) ---------- */
(async function(){
  const a=new URLSearchParams(location.search).get("a");
  if(a){try{assignment=await unpack("LNA",a);store.set("ln.assignment",assignment)}catch(e){}}
  route();
})();
