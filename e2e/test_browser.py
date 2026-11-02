import re
from pathlib import Path

from playwright.sync_api import expect

from browser_support import application, browser

REPO = Path(__file__).resolve().parents[1]
SERVER = ['node', 'node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '18312']
URL = 'http://127.0.0.1:18312'


def test_scamshield_local_analysis_history_and_storage_retry():
    with application('scamshield', SERVER, REPO, URL) as url, browser() as b:
        page = b.new_page(viewport={'width': 390, 'height': 844})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.add_init_script("""(() => { const original = Storage.prototype.setItem; window.__restoreSetItem = () => { Storage.prototype.setItem = original; }; Storage.prototype.setItem = function(key, value) { if (key === 'scamshield.analysisHistory') throw new DOMException('Full', 'QuotaExceededError'); return original.call(this, key, value); }; })();""")
        content = 'PILNE! Konto bankowe zostanie zablokowane. Wyślij hasło i kod BLIK na http://fake-bank.example.'
        page.goto(url + '/analyze')
        page.get_by_label('Treść wiadomości', exact=True).fill(content)
        page.get_by_role('button', name='Sprawdź wiadomość', exact=True).click()
        expect(page.get_by_text(re.compile('Wysokie ryzyko|Krytyczne ryzyko')).first).to_be_visible()
        expect(page.get_by_role('status')).to_contain_text('Nie zapisano historii')
        page.evaluate('window.__restoreSetItem()')
        page.get_by_role('button', name='Ponów zapis', exact=True).click()
        expect(page.get_by_role('status')).to_have_count(0)
        page.evaluate('window.scrollTo(0, 0)')
        page.screenshot(path=str(REPO / 'public' / 'screenshots' / 'mobile-analyzer.png'), full_page=True)
        page.goto(url + '/history')
        expect(page.get_by_text(content, exact=True)).to_be_visible()
        page.reload()
        expect(page.get_by_text(content, exact=True)).to_be_visible()
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        assert not errors, errors


def test_pwa_removes_old_cache_uses_current_html_and_falls_back_offline():
    with application('scamshield', SERVER, REPO, URL) as url, browser() as b:
        context = b.new_context(viewport={'width': 390, 'height': 844}, service_workers='allow')
        page = context.new_page()
        page.add_init_script("""(() => { const original = navigator.serviceWorker.register.bind(navigator.serviceWorker); navigator.serviceWorker.register = async (...args) => { const old = await caches.open('scamshield-senior-v1'); await old.put(location.origin + '/history', new Response('<h1>STALE VERSION A</h1>', {headers:{'Content-Type':'text/html'}})); return original(...args); }; })();""")
        page.goto(url)
        page.wait_for_function('navigator.serviceWorker.controller !== null')
        cache_names = page.evaluate('caches.keys()')
        assert len(cache_names) == 1
        assert re.fullmatch(r'scamshield-[0-9a-f]{16}', cache_names[0])
        assert 'scamshield-senior-v1' not in cache_names

        page.evaluate("""async () => { const name = (await caches.keys()).find(key => key.startsWith('scamshield-')); const cache = await caches.open(name); await cache.put(location.origin + '/history', new Response('<h1>STALE VERSION A</h1>', {headers:{'Content-Type':'text/html'}})); }""")
        page.goto(url + '/history')
        expect(page.get_by_role('heading', name='Historia analiz', exact=True)).to_be_visible()
        expect(page.get_by_text('STALE VERSION A')).to_have_count(0)

        context.set_offline(True)
        page.goto(url + '/history')
        expect(page.get_by_role('heading', name='Brak połączenia', exact=True)).to_be_visible()
        context.set_offline(False)
        context.close()
