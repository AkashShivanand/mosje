const fs=require("fs"),path=require("path"),puppeteer=require("puppeteer-core");
const CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const d=JSON.parse(fs.readFileSync("report-sections.json","utf8"));
const want=process.argv.slice(2).map(Number);
(async()=>{
  const b=await puppeteer.launch({executablePath:CHROME,headless:"new",args:["--allow-file-access-from-files","--no-sandbox","--disable-gpu"]});
  for(const i of want){
    const tmp=path.join(__dirname,`.s_${i}.html`);
    fs.writeFileSync(tmp,`<!doctype html><html><head><meta charset=utf-8><style>${d.css}</style></head><body>${d.sections[i]}</body></html>`);
    const p=await b.newPage(); await p.setViewport({width:d.width,height:900,deviceScaleFactor:2});
    await p.goto("file://"+tmp,{waitUntil:"networkidle0"}); try{await p.evaluate(()=>document.fonts.ready);}catch(e){}
    await p.screenshot({path:`sec_${i}.png`,fullPage:true}); await p.close(); fs.unlinkSync(tmp); console.log("shot",i);
  } await b.close();
})().catch(e=>{console.error(e.message);process.exit(1);});
