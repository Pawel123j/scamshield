import re
from pathlib import Path
from playwright.sync_api import expect
from browser_support import browser, static_site, application

REPO = Path(__file__).resolve().parents[1]

def test_scamshield_local_analysis_history():
    with application('scamshield',['node','node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','18312'],REPO,'http://127.0.0.1:18312') as url,browser() as b:
        page=b.new_page(viewport={'width':390,'height':844})
        errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        content='URGENT! Your bank account is blocked. Send your password and BLIK code to http://fake-bank.example immediately.'
        page.goto(url+'/analyze')
        page.get_by_label('Suspicious content',exact=True).fill(content)
        page.get_by_role('button',name='Analyze',exact=True).click()
        expect(page.get_by_text(re.compile('High risk|Critical risk')).first).to_be_visible()
        page.goto(url+'/history')
        expect(page.get_by_text(content,exact=True)).to_be_visible()
        page.reload()
        expect(page.get_by_text(content,exact=True)).to_be_visible()
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        assert not errors,errors
