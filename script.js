const cfg={key:'12e66aee9a7b5c3141fc50e34412d03b',delay:250};
const el={load:document.getElementById('loading'),err:document.getElementById('error'),inp:document.getElementById('cityInput'),btn:document.getElementById('searchBtn'),cur:document.getElementById('current'),fore:document.getElementById('forecast')};
let t;
el.inp.value=localStorage.getItem('city')||'';
el.btn.onclick=go;
el.inp.oninput=()=>{clearTimeout(t);t=setTimeout(go,cfg.delay);};
function go(){const v=el.inp.value.trim();if(v){localStorage.setItem('city',v);fetchData(v);}}
async function fetchData(city){
ui(true); clearError();
try{
const [a,b]=await Promise.all([fetchJSON('weather',city),fetchJSON('forecast',city)]);
ui(false); show(a,b);
}catch(e){ui(false); showErr(e.message);}
}
function fetchJSON(type,city){return fetch(`https://api.openweathermap.org/data/2.5/${type}?q=${city}&appid=${cfg.key}&units=metric`).then(r=>{if(!r.ok) throw new Error('City not found');return r.json();});}
function show(c,f){el.cur.innerHTML=`<h2>${c.name}</h2><p>${c.main.temp}°C ${c.weather[0].description}</p>`;el.fore.innerHTML=f.list.slice(0,8).map(i=>`<div>${new Date(i.dt*1000).getHours()}h ${i.main.temp}°C</div>`).join('');}
function ui(on){el.load.classList.toggle('hidden',!on);}
function showErr(m){el.err.textContent=m;el.err.classList.remove('hidden');}
function clearError(){el.err.textContent='';el.err.classList.add('hidden');}
