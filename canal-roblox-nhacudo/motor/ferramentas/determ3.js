const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const T=[2.0,15.0,41.0,66.0,99.0,117.5];
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const shots=[];
for(const order of [T,[...T].reverse().map(x=>x)]){const p=await b.newPage({viewport:{width:360,height:640}});await p.goto('http://localhost:8767/ep3.html?nocap=1');await p.waitForFunction('window.ready===true',null,{timeout:400000});
  const m={};for(const t of order){await p.evaluate(t=>renderAt(t),t);m[t]=await p.screenshot({type:'png'})}shots.push(m);await p.close()}
const {PNG}=(()=>{try{return require('/opt/node22/lib/node_modules/pngjs')}catch(e){return {}}})();
require('fs').mkdirSync('e3/det',{recursive:true});for(const t of T){const a=shots[0][t],c=shots[1][t];require('fs').writeFileSync('e3/det/a_'+t+'.png',a);require('fs').writeFileSync('e3/det/b_'+t+'.png',c);console.log(t, a.equals(c)?'IDENTICO':'DIFERENTE ('+a.length+' vs '+c.length+')')}
await b.close()})();
