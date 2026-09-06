"""Read-only crawl of sitemap URLs plus routing and crawler checks. No dependencies."""
import concurrent.futures
import json
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

base = (sys.argv[1] if len(sys.argv) > 1 else 'https://jelena.rajkovic.coach').rstrip('/')


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.result = {'h1': 0, 'images_missing_alt': 0, 'font_preloads': 0, 'alternates': {}}
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'html': self.result['lang'] = a.get('lang')
        if tag == 'h1': self.result['h1'] += 1
        if tag == 'title': self.in_title = True
        if tag == 'img' and 'alt' not in a: self.result['images_missing_alt'] += 1
        if tag == 'meta' and a.get('name') in ['description', 'robots']:
            self.result[a['name']] = a.get('content')
        if tag == 'meta' and a.get('property') == 'og:image': self.result['og_image'] = a.get('content')
        if tag == 'link':
            if a.get('rel') == 'canonical': self.result['canonical'] = a.get('href')
            if a.get('rel') == 'alternate': self.result['alternates'][a.get('hreflang')] = a.get('href')
            if a.get('rel') == 'preload' and a.get('as') == 'font': self.result['font_preloads'] += 1

    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False

    def handle_data(self, data):
        if self.in_title: self.result['title'] = self.result.get('title', '') + data


def fetch(url):
    try:
        response = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'SEO-audit/1.0'}), timeout=45)
    except urllib.error.HTTPError as e:
        response = e
    return response, response.read().decode('utf-8', errors='replace')


_, sitemap = fetch(base + '/sitemap.xml')
urls = {el.text for el in ET.fromstring(sitemap).findall('.//{*}loc')}
# Include alternates even if missing from the sitemap's <loc> entries.
urls.update(el.attrib['href'] for el in ET.fromstring(sitemap).findall('.//{*}link'))
urls.update(base + p for p in ['/me/o-meni', '/missing-seo-audit-page', '/admin/login', '/og-default.jpg'])


def inspect(url):
    response, body = fetch(url)
    page = Page()
    if 'text/html' in response.headers.get('Content-Type', ''): page.feed(body)
    return {'url': url, 'status': response.status, 'final_url': response.url,
            'x_robots_tag': response.headers.get('X-Robots-Tag'),
            'font_preload_headers': response.headers.get('Link', '').count('as="font"'), **page.result}


with concurrent.futures.ThreadPoolExecutor(max_workers=1 if 'localhost' in base else 3) as pool:
    results = list(pool.map(inspect, sorted(urls)))
print(json.dumps({'base': base, 'sitemap_entries': len(ET.fromstring(sitemap).findall('.//{*}loc')),
                  'robots': fetch(base + '/robots.txt')[1], 'pages': results}, ensure_ascii=False, indent=2))
