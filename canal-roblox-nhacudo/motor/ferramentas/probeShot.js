const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const [,,url,t]=process.argv;
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:720,height:1280}});
await p.goto(url);await p.waitForFunction('window.ready===true',null,{timeout:240000});
const r=await p.evaluate(t=>{renderAt(t);let i=SHOTS.length-1;while(i>0&&SHOTS[i][1]>t)i--;return {shot:SHOTS[i][0],start:SHOTS[i][1],next:SHOTS[i+1]&&SHOTS[i+1][1]}},+t);console.log(JSON.stringify(r));await b.close()})();
