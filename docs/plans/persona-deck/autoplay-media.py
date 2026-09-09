"""Make every video in the deck start when its slide opens.
pptxgenjs cannot set this; PowerPoint stores it as a <p:timing> block that
calls playFrom(0.0) on the media shape. Run after build.cjs, in place."""
import re, sys, zipfile, shutil, os
TIMING = ('<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
 '<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst><p:par>'
 '<p:cTn id="3" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst>'
 '<p:childTnLst><p:par><p:cTn id="4" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst><p:par>'
 '<p:cTn id="5" presetID="1" presetClass="mediacall" presetSubtype="0" fill="hold" nodeType="withEffect"><p:stCondLst><p:cond delay="0"/></p:stCondLst>'
 '<p:childTnLst><p:cmd type="call" cmd="playFrom(0.0)"><p:cBhvr><p:cTn id="6" dur="1" fill="hold"/><p:tgtEl><p:spTgt spid="{SPID}"/></p:tgtEl></p:cBhvr></p:cmd>'
 '</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn>'
 '<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
 '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq></p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>')
src = sys.argv[1]; tmp = src + '.tmp'
done = 0
with zipfile.ZipFile(src) as zin, zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if re.match(r'ppt/slides/slide\d+\.xml$', item.filename):
            xml = data.decode('utf8')
            if '<p:timing>' not in xml:
                pics = [m for m in re.finditer(r'<p:pic>.*?</p:pic>', xml, re.S) if 'videoFile' in m.group(0)]
                if pics:
                    spid = re.search(r'<p:cNvPr id="(\d+)"', pics[0].group(0)).group(1)
                    xml = xml.replace('</p:sld>', TIMING.replace('{SPID}', spid) + '</p:sld>')
                    done += 1
            data = xml.encode('utf8')
        zout.writestr(item, data)
shutil.move(tmp, src); print('autoplay set on', done, 'slides')
