const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:360,height:640}});
await p.goto(process.argv[2]);await p.waitForFunction('window.ready===true',null,{timeout:400000});
console.log(await p.evaluate(()=>{const S=window.SHOTS;return S.map((s,i)=>((s[1]+(i<S.length-1?S[i+1][1]:window.END))/2).toFixed(2)).join(',')}));await b.close()})();
