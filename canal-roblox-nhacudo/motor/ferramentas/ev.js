const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:360,height:640}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto(process.argv[2]);await p.waitForFunction('window.ready===true',null,{timeout:400000});
console.log(await p.evaluate(process.argv[3]));await b.close()})();
