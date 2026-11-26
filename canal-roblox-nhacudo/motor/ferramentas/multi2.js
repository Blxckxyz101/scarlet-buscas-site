const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const [,,url,outPrefix,times]=process.argv;const DSF=+(process.env.DSF||1);
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:720,height:1280},deviceScaleFactor:DSF});p.on('pageerror',async e=>{console.log('ERR',e.message);process.exit(1)});p.on('console',m=>{if(/rror/.test(m.text())&&!/GL Driver/.test(m.text()))console.log('LOG',m.text())});
await p.goto(url);await p.waitForFunction('window.ready===true',null,{timeout:240000});
for(const t of times.split(',')){const t0=Date.now();await p.evaluate(t=>renderAt(t),+t);await p.screenshot({path:`${outPrefix}_${t}.jpg`,type:'jpeg',quality:85});console.log(t,Date.now()-t0,'ms')}
await b.close()})();
