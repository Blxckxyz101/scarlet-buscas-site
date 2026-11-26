const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:720,height:1280}});
await p.goto(process.argv[2]);await p.waitForFunction('window.ready===true',null,{timeout:240000});
console.log(JSON.stringify(await p.evaluate(()=>SHOTS)));await b.close()})();
