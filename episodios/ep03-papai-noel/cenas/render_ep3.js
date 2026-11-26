const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs');
const [,,out,from,to]=process.argv;const FPS=30;
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:720,height:1280},deviceScaleFactor:1.5});p.on('pageerror',e=>{console.log('ERR',e.message)});
await p.goto('http://localhost:8767/ep3.html');await p.waitForFunction('window.ready===true',null,{timeout:400000});
for(let i=+from;i<+to;i++){const f=`${out}/f${String(i).padStart(5,'0')}.jpg`;if(fs.existsSync(f))continue;await p.evaluate(t=>renderAt(t),i/FPS);await p.screenshot({path:f,type:'jpeg',quality:92});if(i%100==0)console.log('frame',i)}
console.log('DONE',from,to);await b.close()})();
