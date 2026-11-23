const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const [,,outDir,times]=process.argv;
(async()=>{
  const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:720,height:1280},deviceScaleFactor:1});
  p.on('console',m=>console.log('PAGE',m.text()));p.on('pageerror',e=>console.log('ERR',e.message));
  await p.goto('http://127.0.0.1:8765/index.html');await p.waitForFunction('window.ready===true',null,{timeout:60000});
  await p.evaluate(()=>document.fonts.ready);
  let list;
  if(times==='all'){list=[];for(let i=0;i<Math.round(14.5*30);i++)list.push(i/30)}else list=times.split(',').map(Number);
  const t0=Date.now();
  for(let i=0;i<list.length;i++){await p.evaluate(t=>window.renderAt(t),list[i]);
    await p.screenshot({path:`${outDir}/f${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:92});
    if(i%60==0)console.log(i,list.length,(Date.now()-t0)/1000)}
  await b.close();
})();
