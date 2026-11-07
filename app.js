const {useState,useEffect}=React;const html=htm.bind(React.createElement);
const ROLES={Admin:["dashboard","patients","doctors","appointments","billing"],Doctor:["dashboard","patients","doctors","appointments"],Receptionist:["dashboard","patients","doctors","appointments","billing"]};
const ICON={dashboard:"▦",patients:"☺",doctors:"✚",appointments:"◷",billing:"₨"};
const money=n=>"Rs "+n.toLocaleString(),nid=a=>Math.max(0,...a.map(x=>x.id))+1,opt=a=>a.map(x=>[x,x]);
const nameOf=(a,id)=>(a.find(x=>x.id==id)||{}).name||"—";
function useStore(k,d){const[v,s]=useState(()=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}});
 useEffect(()=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},[v]);return[v,s]}
function useHash(){const g=()=>location.hash.slice(2)||"dashboard";const[h,s]=useState(g);
 useEffect(()=>{const f=()=>s(g());addEventListener("hashchange",f);return()=>removeEventListener("hashchange",f)},[]);return h}

const Badge=({t})=>html`<span class=${"badge "+t.toLowerCase()}>${t}</span>`;
const Head=({t,children})=>html`<div class="row between"><h1>${t}</h1><div class="row">${children}</div></div>`;
const Modal=({title,onClose,c="",children})=>html`<div class="overlay" onClick=${onClose}><div class=${"modal "+c} role="dialog" aria-label=${title} onClick=${e=>e.stopPropagation()}><h2>${title}</h2>${children}</div></div>`;

function Form({title,fields,init,onSave,onClose}){
 const[v,s]=useState(init);const[err,setErr]=useState("");
 const set=k=>e=>s({...v,[k]:e.target.value});
 const submit=e=>{e.preventDefault();const m=fields.find(f=>!String(v[f[0]]??"").trim());if(m)return setErr(m[1]+" is required.");onSave(v)};
 return html`<${Modal} title=${title} onClose=${onClose}><form onSubmit=${submit}>
  ${fields.map(([k,l,t,o])=>html`<label key=${k}>${l}${o?html`<select value=${v[k]} onChange=${set(k)}>${o.map(([a,b])=>html`<option key=${a} value=${a}>${b}</option>`)}</select>`:html`<input type=${t||"text"} value=${v[k]} onChange=${set(k)}/>`}</label>`)}
  ${err&&html`<p class="err" role="alert">${err}</p>`}
  <div class="row end"><button type="button" class="btn ghost" onClick=${onClose}>Cancel</button><button class="btn">Save</button></div></form><//>`}

function Login({onLogin}){
 const[role,setRole]=useState("Admin");const[name,setName]=useState("");
 const info={Admin:"Full access to every module",Doctor:"Patients, doctors and appointments",Receptionist:"Patients, appointments and billing"};
 return html`<div class="login"><section class="brand"><div class="logo">✚ MediCare</div><h1>Care that runs on clear information.</h1><p>Manage patients, doctors, appointments and billing from one calm workspace.</p></section>
 <form class="signin" onSubmit=${e=>{e.preventDefault();onLogin({role,name:name.trim()||role})}}><h2>Welcome back</h2><p class="muted">Choose how you want to sign in.</p>
  <div class="roles" role="radiogroup" aria-label="Role">${Object.keys(ROLES).map(r=>html`<button type="button" role="radio" aria-checked=${role===r} key=${r} class=${"role"+(role===r?" sel":"")} onClick=${()=>setRole(r)}><b>${r}</b><span>${info[r]}</span></button>`)}</div>
  <label>Your name<input value=${name} onChange=${e=>setName(e.target.value)} placeholder="e.g. Sara"/></label>
  <button class="btn wide">Sign in as ${role}</button><p class="muted small">Demo only: no password needed. All patient data is fake.</p></form></div>`}

const Bars=({title,data})=>{const m=Math.max(1,...data.map(d=>d[1]));
 return html`<div class="card"><h3>${title}</h3><div class="bars">${data.map(([l,v])=>html`<div class="bar" key=${l}><span>${v}</span><i style=${{height:v/m*120+"px"}}></i><b>${l}</b></div>`)}</div></div>`};

function Dash({S}){
 const sum=a=>a.reduce((s,i)=>s+i.amount,0),paid=sum(S.invoices.filter(i=>i.paid)),due=sum(S.invoices.filter(i=>!i.paid));
 const today=S.appts.filter(a=>a.date===TODAY);
 const cards=[["Patients",S.patients.length,S.patients.filter(p=>p.status==="Admitted").length+" admitted now"],["Doctors",S.doctors.length,S.doctors.filter(d=>d.available).length+" available"],["Appointments today",today.length,today.filter(a=>a.status==="Pending").length+" awaiting confirmation"],["Revenue collected",money(paid),money(due)+" outstanding"]];
 const specs=[...new Set(S.doctors.map(d=>d.spec))];
 const next=[...S.appts].filter(a=>a.status!=="Completed"&&a.date>=TODAY).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,5);
 return html`<${Head} t=${"Good day, "+S.user.name}/><p class="muted lead">${new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
 <div class="grid4">${cards.map(([l,v,s])=>html`<div class="card stat" key=${l}><span class="muted">${l}</span><b>${v}</b><small class="muted">${s}</small></div>`)}</div>
 <div class="grid2"><${Bars} title="Appointments by status" data=${["Pending","Confirmed","Completed"].map(s=>[s,S.appts.filter(a=>a.status===s).length])}/>
 <${Bars} title="Appointments by department" data=${specs.map(sp=>[sp.split(" ")[0],S.appts.filter(a=>(S.doctors.find(d=>d.id===a.did)||{}).spec===sp).length])}/></div>
 <div class="card tw"><h3>Upcoming appointments</h3><table><thead><tr><th>When</th><th>Patient</th><th>Doctor</th><th>Status</th></tr></thead><tbody>
 ${next.map(a=>html`<tr key=${a.id}><td>${a.date} ${a.time}</td><td><a href=${"#/patients/"+a.pid}>${nameOf(S.patients,a.pid)}</a></td><td>${nameOf(S.doctors,a.did)}</td><td><${Badge} t=${a.status}/></td></tr>`)}
 </tbody></table>${!next.length&&html`<p class="muted">Nothing scheduled. Book an appointment to see it here.</p>`}</div>`}

const BLANK={name:"",age:"",gender:"F",phone:"",condition:"",status:"Outpatient",did:0};
function Patients({S,id}){
 const{patients,setPatients}=S;const[q,setQ]=useState("");const[f,setF]=useState("All");const[pg,setPg]=useState(1);const[m,setM]=useState(null);const can=S.user.role!=="Doctor";
 if(id){const p=patients.find(x=>x.id==id);
  if(!p)return html`<p>Patient not found. <a href="#/patients"><u>Back to patients</u></a></p>`;
  const ap=S.appts.filter(a=>a.pid==id),inv=S.invoices.filter(i=>i.pid==id);
  return html`<a href="#/patients" class="muted">← All patients</a>
  <div class="card detail"><div class="avatar">${p.name[0]}</div><div><h2>${p.name}</h2><p class="muted">${p.age} years, ${p.gender==="F"?"Female":"Male"}, ${p.phone}</p><p>Doctor: ${p.did?html`<a href=${"#/doctors/"+p.did}><u>${nameOf(S.doctors,p.did)}</u></a>`:"Unassigned"}</p><${Badge} t=${p.status}/> <span class="muted">${p.condition}</span></div></div>
  <div class="grid2"><div class="card"><h3>Appointments</h3>${ap.length?ap.map(a=>html`<p key=${a.id}>${a.date} at ${a.time}, ${nameOf(S.doctors,a.did)} <${Badge} t=${a.status}/></p>`):html`<p class="muted">No appointments yet.</p>`}</div>
  <div class="card"><h3>Invoices</h3>${inv.length?inv.map(i=>html`<p key=${i.id}>#${i.id} ${i.item}, ${money(i.amount)} <${Badge} t=${i.paid?"Paid":"Unpaid"}/></p>`):html`<p class="muted">No invoices yet.</p>`}</div></div>`}
 const list=patients.filter(p=>(f==="All"||p.status===f)&&(p.name+p.condition+p.phone+nameOf(S.doctors,p.did)).toLowerCase().includes(q.toLowerCase()));
 const pages=Math.max(1,Math.ceil(list.length/5)),cur=Math.min(pg,pages),rows=list.slice((cur-1)*5,cur*5);
 const save=v=>{const o={...v,age:+v.age,did:+v.did};setPatients(m.id?patients.map(x=>x.id===m.id?{...x,...o}:x):[...patients,{...o,id:nid(patients)}]);setM(null)};
 return html`<${Head} t="Patients">
  <input type="search" aria-label="Search patients" placeholder="Search name, condition, phone" value=${q} onChange=${e=>{setQ(e.target.value);setPg(1)}}/>
  <select aria-label="Filter by status" value=${f} onChange=${e=>{setF(e.target.value);setPg(1)}}>${["All","Outpatient","Admitted"].map(s=>html`<option key=${s}>${s}</option>`)}</select>
  ${can&&html`<button class="btn" onClick=${()=>setM({})}>Add patient</button>`}<//>
 <div class="card tw"><table><thead><tr><th>Name</th><th>Age</th><th>Condition</th><th>Doctor</th><th>Status</th><th>Actions</th></tr></thead><tbody>
  ${rows.map(p=>html`<tr key=${p.id}><td><a href=${"#/patients/"+p.id}><b>${p.name}</b></a></td><td>${p.age}</td><td>${p.condition}</td><td>${p.did?html`<a href=${"#/doctors/"+p.did}>${nameOf(S.doctors,p.did)}</a>`:html`<span class="muted">Unassigned</span>`}</td><td><${Badge} t=${p.status}/></td>
  <td class="row"><a class="btn ghost sm" href=${"#/patients/"+p.id}>View</a>${can&&html`<button class="btn ghost sm" onClick=${()=>setM(p)}>Edit</button><button class="btn ghost sm" onClick=${()=>confirm("Delete "+p.name+"?")&&setPatients(patients.filter(x=>x.id!==p.id))}>Delete</button>`}</td></tr>`)}
 </tbody></table>${!rows.length&&html`<p class="muted">No patients match your search. Clear the filters to see everyone.</p>`}
 <div class="pager"><span class="muted">${list.length} patients</span><div class="row"><button class="btn ghost sm" disabled=${cur<2} onClick=${()=>setPg(cur-1)}>Previous</button><span>Page ${cur} of ${pages}</span><button class="btn ghost sm" disabled=${cur>=pages} onClick=${()=>setPg(cur+1)}>Next</button></div></div></div>
 ${m&&html`<${Form} title=${m.id?"Edit patient":"Add patient"} fields=${[["name","Full name"],["age","Age","number"],["gender","Gender","",[["F","Female"],["M","Male"]]],["phone","Phone"],["condition","Condition"],["status","Status","",opt(["Outpatient","Admitted"])],["did","Assigned doctor","",[[0,"Unassigned"],...S.doctors.map(d=>[d.id,d.name])]]]} init=${{...BLANK,...m}} onSave=${save} onClose=${()=>setM(null)}/>`}`}

const DBLANK={name:"",spec:"",exp:"",fee:"",phone:"",days:"Mon to Fri",available:"true"};
const ini=d=>d.name.replace(/^Dr\.?\s*/i,"")[0]||"D";
function Doctors({S,id}){
 const{doctors,setDoctors,patients,setPatients,appts}=S;const admin=S.user.role==="Admin";
 const[f,setF]=useState("All");const[q,setQ]=useState("");const[m,setM]=useState(null);
 const cnt=d=>patients.filter(p=>p.did===d.id).length,sched=(a,b)=>(a.date+a.time).localeCompare(b.date+b.time);
 const save=v=>{const n=v.name.trim(),o={name:/^dr\b/i.test(n)?n:"Dr. "+n,spec:v.spec.trim(),exp:+v.exp,fee:+v.fee,phone:v.phone,days:v.days,available:v.available==="true"};
  setDoctors(m.id?doctors.map(x=>x.id===m.id?{...x,...o}:x):[...doctors,{...o,id:nid(doctors)}]);setM(null)};
 const del=d=>{const n=cnt(d);if(confirm("Remove "+d.name+"?"+(n?" Their "+n+" patients will become unassigned.":""))){setPatients(patients.map(p=>p.did===d.id?{...p,did:0}:p));setDoctors(doctors.filter(x=>x.id!==d.id));location.hash="#/doctors"}};
 const flip=d=>setDoctors(doctors.map(x=>x.id===d.id?{...x,available:!x.available}:x));
 const form=m&&html`<${Form} title=${m.id?"Edit doctor":"Add doctor"} fields=${[["name","Full name"],["spec","Specialization"],["exp","Experience (years)","number"],["fee","Consultation fee (Rs)","number"],["phone","Phone"],["days","Working days"],["available","Status","",[["true","Available"],["false","On leave"]]]]} init=${{...DBLANK,...m,available:String(m.available??true)}} onSave=${save} onClose=${()=>setM(null)}/>`;
 const tag=d=>html`<span class=${"badge "+(d.available?"paid":"unpaid")}>${d.available?"Available":"On leave"}</span>`;
 if(id){const d=doctors.find(x=>x.id==id);
  if(!d)return html`<p>Doctor not found. <a href="#/doctors"><u>Back to doctors</u></a></p>`;
  const mine=patients.filter(p=>p.did===d.id),ap=appts.filter(a=>a.did===d.id).sort(sched);
  const stats=[["Patients under care",mine.length],["Appointments",ap.length],["Today",ap.filter(a=>a.date===TODAY).length],["Consultation fee",money(d.fee)]];
  return html`<a href="#/doctors" class="muted">← All doctors</a>
  <div class="card detail"><div class="avatar">${ini(d)}</div><div><h2>${d.name}</h2><p class="muted">${d.spec}, ${d.exp} years of experience</p><p class="muted">Works ${d.days}. Phone ${d.phone}.</p>${tag(d)}</div>
   ${admin&&html`<div class="row push"><button class="btn ghost sm" onClick=${()=>setM(d)}>Edit</button><button class="btn ghost sm" onClick=${()=>flip(d)}>Change availability</button><button class="btn ghost sm" onClick=${()=>del(d)}>Remove</button></div>`}</div>
  <div class="grid4">${stats.map(([l,v])=>html`<div class="card stat" key=${l}><span class="muted">${l}</span><b>${v}</b></div>`)}</div>
  <div class="grid2"><div class="card tw"><h3>Patients under care</h3><table><thead><tr><th>Name</th><th>Condition</th><th>Status</th></tr></thead><tbody>${mine.map(p=>html`<tr key=${p.id}><td><a href=${"#/patients/"+p.id}><b>${p.name}</b></a></td><td>${p.condition}</td><td><${Badge} t=${p.status}/></td></tr>`)}</tbody></table>${!mine.length&&html`<p class="muted">No patients assigned yet. Assign this doctor when adding or editing a patient.</p>`}</div>
  <div class="card tw"><h3>Appointments</h3><table><thead><tr><th>When</th><th>Patient</th><th>Status</th></tr></thead><tbody>${ap.map(a=>html`<tr key=${a.id}><td>${a.date} ${a.time}</td><td>${nameOf(patients,a.pid)}</td><td><${Badge} t=${a.status}/></td></tr>`)}</tbody></table>${!ap.length&&html`<p class="muted">No appointments yet.</p>`}</div></div>${form}`}
 const specs=[...new Set(doctors.map(d=>d.spec))];
 const list=doctors.filter(d=>(f==="All"||d.spec===f)&&(d.name+d.spec).toLowerCase().includes(q.toLowerCase()));
 return html`<${Head} t="Doctors"><input type="search" aria-label="Search doctors" placeholder="Search name or specialty" value=${q} onChange=${e=>setQ(e.target.value)}/>
  <select aria-label="Specialization" value=${f} onChange=${e=>setF(e.target.value)}>${["All",...specs].map(s=>html`<option key=${s}>${s}</option>`)}</select>
  ${admin&&html`<button class="btn" onClick=${()=>setM({})}>Add doctor</button>`}<//>
 <div class="grid3">${list.map(d=>html`<div class="card dcard" key=${d.id}><div class="avatar">${ini(d)}</div><h3><a href=${"#/doctors/"+d.id}>${d.name}</a></h3><p class="muted">${d.spec}, ${d.exp} years</p>
  <p class="small">${cnt(d)} patients, ${appts.filter(a=>a.did===d.id&&a.date===TODAY).length} appointments today</p>
  <div class="row">${tag(d)}<a class="btn ghost sm" href=${"#/doctors/"+d.id}>View profile</a>${admin&&html`<button class="btn ghost sm" onClick=${()=>flip(d)}>Change</button>`}</div></div>`)}</div>
 ${!list.length&&html`<p class="muted">No doctors found. Clear the search or add a doctor.</p>`}${form}`}

function Appts({S}){
 const{appts,setAppts,patients,doctors}=S;const[m,setM]=useState(null);const[st,setSt]=useState("All");const can=S.user.role!=="Doctor";
 const rows=[...appts].filter(a=>st==="All"||a.status===st).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
 const book=v=>{setAppts([...appts,{id:nid(appts),pid:+v.pid,did:+v.did,date:v.date,time:v.time,status:"Pending"}]);setM(null)};
 const move=v=>{setAppts(appts.map(a=>a.id===m.id?{...a,date:v.date,time:v.time}:a));setM(null)};
 const DT=[["date","Date","date"],["time","Time","time"]];
 return html`<${Head} t="Appointments"><select aria-label="Filter by status" value=${st} onChange=${e=>setSt(e.target.value)}>${["All","Pending","Confirmed","Completed"].map(s=>html`<option key=${s}>${s}</option>`)}</select>
  ${can&&html`<button class="btn" onClick=${()=>setM({book:1})}>Book appointment</button>`}<//>
 <div class="card tw"><table><thead><tr><th>When</th><th>Patient</th><th>Doctor</th><th>Status</th><th>Actions</th></tr></thead><tbody>
 ${rows.map(a=>html`<tr key=${a.id}><td>${a.date} ${a.time}</td><td><a href=${"#/patients/"+a.pid}>${nameOf(patients,a.pid)}</a></td><td>${nameOf(doctors,a.did)}</td>
  <td><select aria-label="Status" value=${a.status} onChange=${e=>setAppts(appts.map(x=>x.id===a.id?{...x,status:e.target.value}:x))}>${["Pending","Confirmed","Completed"].map(s=>html`<option key=${s}>${s}</option>`)}</select></td>
  <td class="row">${can&&html`<button class="btn ghost sm" onClick=${()=>setM(a)}>Reschedule</button><button class="btn ghost sm" onClick=${()=>confirm("Cancel this appointment?")&&setAppts(appts.filter(x=>x.id!==a.id))}>Cancel</button>`}</td></tr>`)}
 </tbody></table>${!rows.length&&html`<p class="muted">No appointments here. Book one to get started.</p>`}</div>
 ${m&&m.book&&html`<${Form} title="Book appointment" fields=${[["pid","Patient","",patients.map(p=>[p.id,p.name])],["did","Doctor","",doctors.filter(d=>d.available).map(d=>[d.id,d.name])],...DT]} init=${{pid:(patients[0]||{}).id,did:(doctors.find(d=>d.available)||{}).id,date:TODAY,time:"09:00"}} onSave=${book} onClose=${()=>setM(null)}/>`}
 ${m&&m.id&&html`<${Form} title="Reschedule appointment" fields=${DT} init=${{date:m.date,time:m.time}} onSave=${move} onClose=${()=>setM(null)}/>`}`}

function Billing({S}){
 const{invoices,setInvoices,patients}=S;const[m,setM]=useState(false);const[pr,setPr]=useState(null);
 const add=v=>{setInvoices([...invoices,{id:nid(invoices),pid:+v.pid,date:TODAY,item:v.item,amount:+v.amount,paid:false}]);setM(false)};
 return html`<${Head} t="Billing"><button class="btn" onClick=${()=>setM(true)}>Create invoice</button><//>
 <div class="card tw"><table><thead><tr><th>Invoice</th><th>Patient</th><th>Item</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>
 ${invoices.map(i=>html`<tr key=${i.id}><td>#${i.id}</td><td>${nameOf(patients,i.pid)}</td><td>${i.item}</td><td>${money(i.amount)}</td><td><${Badge} t=${i.paid?"Paid":"Unpaid"}/></td>
  <td class="row"><button class="btn ghost sm" onClick=${()=>setInvoices(invoices.map(x=>x.id===i.id?{...x,paid:!x.paid}:x))}>${i.paid?"Mark unpaid":"Mark paid"}</button><button class="btn ghost sm" onClick=${()=>setPr(i)}>Print view</button></td></tr>`)}
 </tbody></table></div>
 ${m&&html`<${Form} title="Create invoice" fields=${[["pid","Patient","",patients.map(p=>[p.id,p.name])],["item","Item"],["amount","Amount (Rs)","number"]]} init=${{pid:(patients[0]||{}).id,item:"",amount:""}} onSave=${add} onClose=${()=>setM(false)}/>`}
 ${pr&&html`<${Modal} title=${"Invoice #"+pr.id} c="invoice" onClose=${()=>setPr(null)}>
  <div class="row between"><div><b class="logo2">✚ MediCare Hospital</b><p class="muted small">Thank you for choosing us.</p></div><div><b>Date</b><p class="muted small">${pr.date}</p></div></div>
  <p class="muted small">Billed to</p><p><b>${nameOf(patients,pr.pid)}</b></p>
  <table><thead><tr><th>Description</th><th>Amount</th></tr></thead><tbody><tr><td>${pr.item}</td><td>${money(pr.amount)}</td></tr><tr><td><b>Total</b></td><td><b>${money(pr.amount)}</b></td></tr></tbody></table>
  <p>Status: <${Badge} t=${pr.paid?"Paid":"Unpaid"}/></p>
  <div class="row end no-print"><button class="btn ghost" onClick=${()=>setPr(null)}>Close</button><button class="btn" onClick=${()=>window.print()}>Print invoice</button></div><//>`}`}

function App(){
 const[user,setUser]=useStore("hms_user",null);const route=useHash();
 const[patients,setPatients]=useStore("hms2_patients",DB.patients),[doctors,setDoctors]=useStore("hms2_doctors",DB.doctors);
 const[appts,setAppts]=useStore("hms2_appts",DB.appts),[invoices,setInvoices]=useStore("hms2_invoices",DB.invoices);
 const[toast,setToast]=useState("");const say=m=>{setToast(m);setTimeout(()=>setToast(""),2500)};
 if(!user)return html`<${Login} onLogin=${setUser}/>`;
 const[pg,id]=route.split("/"),allowed=ROLES[user.role],p=allowed.includes(pg)?pg:"dashboard";
 const w=f=>v=>{f(v);say("Changes saved")};const S={user,patients,setPatients:w(setPatients),doctors,setDoctors:w(setDoctors),appts,setAppts:w(setAppts),invoices,setInvoices:w(setInvoices)};
 const View={dashboard:Dash,patients:Patients,doctors:Doctors,appointments:Appts,billing:Billing}[p];
 return html`<div class="shell"><aside><div class="logo">✚ MediCare</div>
  ${allowed.map(k=>html`<a key=${k} href=${"#/"+k} class=${p===k?"on":""} aria-current=${p===k?"page":undefined}>${ICON[k]} ${k}</a>`)}
  <div class="user"><b>${user.name}</b><br/>${user.role}<br/><button class="btn ghost sm" onClick=${()=>{setUser(null);location.hash=""}}>Log out</button></div></aside>
  <main><${View} S=${S} id=${id}/></main>${toast&&html`<div class="toast" role="status">${toast}</div>`}</div>`}
ReactDOM.createRoot(document.getElementById("root")).render(html`<${App}/>`);
