import re
import time
from pathlib import Path

from playwright.sync_api import expect

from browser_support import application, browser

REPO = Path(__file__).resolve().parents[1]


def wait_until(page, expression, timeout_s=15.0):
    """Czeka na warunek przez page.evaluate (CDP), a nie wait_for_function.

    wait_for_function kompiluje wyrażenie tekstowe przez eval w stronie, co aplikacja
    słusznie blokuje polityką CSP bez 'unsafe-eval' (SCAM-02). Test nie wyłącza CSP.
    """
    deadline = time.monotonic() + timeout_s
    while not page.evaluate(expression):
        if time.monotonic() > deadline:
            raise AssertionError(f"Timed out waiting for: {expression}")
        page.wait_for_timeout(100)
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
        wait_until(page, 'navigator.serviceWorker.controller !== null')
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


def test_security_headers_and_csp_are_served():
    """SCAM-02: produkcyjny serwer wysyła CSP i nagłówki bezpieczeństwa."""
    with application('scamshield', SERVER, REPO, URL) as url, browser() as b:
        page = b.new_page()
        response = page.goto(url + '/')
        headers = response.headers
        csp = headers['content-security-policy']
        assert "frame-ancestors 'none'" in csp
        assert "object-src 'none'" in csp
        assert "'unsafe-eval'" not in csp
        assert headers['x-frame-options'] == 'DENY'
        assert headers['x-content-type-options'] == 'nosniff'
        assert 'x-powered-by' not in headers
        violations = []
        page.on('console', lambda m: violations.append(m.text) if 'Content Security Policy' in m.text else None)
        page.goto(url + '/analyze')
        page.wait_for_load_state('networkidle')
        assert violations == []


def test_history_keeps_75_results_across_failed_save_navigation_retry_and_reload():
    with application('scamshield', SERVER, REPO, URL) as url, browser() as b:
        page = b.new_page(viewport={'width': 1280, 'height': 900})
        page.goto(url + '/analyze')
        page.get_by_label('Treść wiadomości', exact=True).fill('Spotkanie jutro w bibliotece.')
        page.get_by_role('button', name='Sprawdź wiadomość', exact=True).click()
        page.wait_for_function("JSON.parse(localStorage.getItem('scamshield.analysisHistory') || '[]').length === 1")
        # A real analyzer result supplies the fixture schema; seed the documented
        # boundary so this tests the hook/UI as well as the storage helper.
        page.evaluate("""() => {
            const sample = JSON.parse(localStorage.getItem('scamshield.analysisHistory'))[0];
            const history = Array.from({length:75}, (_, i) => ({...sample,
                id:`archive-${i}`, originalText:`Archiwalna wiadomość ${i}`,
                createdAt:i === 4 ? 'not-a-date' : sample.createdAt,
                preview:`Archiwalna wiadomość ${i}`, maskedPreview:`Archiwalna wiadomość ${i}`
            }));
            localStorage.setItem('scamshield.analysisHistory', JSON.stringify(history));
        }""")
        page.reload()
        page.evaluate("""() => {
            const original = Storage.prototype.setItem;
            window.__restoreSetItem = () => { Storage.prototype.setItem = original; };
            Storage.prototype.setItem = function(key, value) {
                if (key === 'scamshield.analysisHistory') throw new DOMException('Full', 'QuotaExceededError');
                return original.call(this, key, value);
            };
        }""")
        content = 'Bank nigdy nie poprosi o PIN ani kod BLIK.'
        page.get_by_label('Treść wiadomości', exact=True).fill(content)
        page.get_by_role('button', name='Sprawdź wiadomość', exact=True).click()
        expect(page.get_by_role('status')).to_contain_text('Nie zapisano historii')
        assert page.evaluate("JSON.parse(localStorage.getItem('scamshield.analysisHistory'))[0].id") == 'archive-0'
        # Client-side navigation must preserve the unsaved result and 74 prior ones.
        page.get_by_role('link', name='Historia', exact=True).click()
        expect(page.locator('tbody tr')).to_have_count(75)
        expect(page.locator('tbody tr').first).to_contain_text(content)
        expect(page.locator('tbody tr').last).to_contain_text('Archiwalna wiadomość 73')
        expect(page.get_by_role('cell', name='Nieznana data', exact=True)).to_have_count(1)
        expect(page.get_by_role('status')).to_contain_text('Nie zapisano historii')
        page.evaluate('window.__restoreSetItem()')
        page.get_by_role('button', name='Ponów zapis', exact=True).click()
        expect(page.get_by_role('status')).to_have_count(0)
        stored = page.evaluate("JSON.parse(localStorage.getItem('scamshield.analysisHistory'))")
        assert len(stored) == 75
        assert stored[0]['originalText'] == content
        assert [item['id'] for item in stored[1:]] == [f'archive-{i}' for i in range(74)]
        page.reload()
        expect(page.locator('tbody tr')).to_have_count(75)
        expect(page.locator('tbody tr').first).to_contain_text(content)
        expect(page.locator('tbody tr').last).to_contain_text('Archiwalna wiadomość 73')
        expect(page.get_by_role('cell', name='Nieznana data', exact=True)).to_have_count(1)
