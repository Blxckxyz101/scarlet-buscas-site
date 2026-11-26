const {chromium}=require('/opt/node22/lib/node_modules/playwright');const [,,url,step]=process.argv;
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:360,height:640}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.addInitScript(()=>{window.QAPOS=1});await p.goto(url);await p.waitForFunction('window.ready===true',null,{timeout:400000});
const times=await p.evaluate(st=>{const S=window.SHOTS;const out=[];for(let i=0;i<S.length;i++){const a=S[i][1],b=i<S.length-1?S[i+1][1]:window.END;for(let t=a+.05;t<b-.02;t+=+st)out.push(+t.toFixed(2))}return out},step||'0.25');
console.log('checking',times.length,'moments');const r=await p.evaluate(ts=>window.QA(ts),times);
const byShot={};r.forEach(x=>{(byShot[x.shot]=byShot[x.shot]||{times:[],hits:new Set()});byShot[x.shot].times.push(x.t);x.hits.forEach(h=>byShot[x.shot].hits.add(h))});
for(const [s,v] of Object.entries(byShot))console.log(`[${s}] ${v.times[0]}-${v.times[v.times.length-1]}s (${v.times.length}x): ${[...v.hits].slice(0,6).join(' | ')}`);
console.log('TOTAL shots with problems:',Object.keys(byShot).length);await b.close()})();
