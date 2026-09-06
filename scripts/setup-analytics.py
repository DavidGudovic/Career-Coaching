"""Initialize the private Umami instance after the owner approves account setup.

Run as the deployment owner on the server, with Umami listening on 127.0.0.1:3002.
Credentials are generated locally, never printed, and saved under .local/analytics.
This script configures reporting but deliberately leaves collection disabled.
"""
import json
import os
from pathlib import Path
import secrets
import urllib.error
import urllib.request
import uuid

root = Path(__file__).resolve().parents[1]
state_path = root / '.local/analytics/setup.json'
state_path.parent.mkdir(parents=True, exist_ok=True)
if state_path.exists():
    state = json.loads(state_path.read_text())
else:
    state = {
        'adminPassword': secrets.token_hex(24),
        'reportPassword': secrets.token_hex(24),
        'reportUserId': str(uuid.uuid4()),
        'websiteId': str(uuid.uuid4()),
    }
    fd = os.open(state_path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, 'w') as f:
        json.dump(state, f)


def api(path, data=None, token=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = 'Bearer ' + token
    request = urllib.request.Request(
        'http://127.0.0.1:3002/api' + path,
        data=None if data is None else json.dumps(data).encode(), headers=headers,
    )
    with urllib.request.urlopen(request, timeout=15) as response:
        return json.load(response)


def login(username, password):
    return api('/auth/login', {'username': username, 'password': password})['token']


try:
    admin = login('admin', state['adminPassword'])
except urllib.error.HTTPError as error:
    if error.code not in (400, 401):
        raise
    admin = login('admin', 'umami')
    api('/me/password', {'currentPassword': 'umami', 'newPassword': state['adminPassword']}, admin)
    admin = login('admin', state['adminPassword'])

try:
    reporter = login('cms-analytics', state['reportPassword'])
except urllib.error.HTTPError as error:
    if error.code not in (400, 401):
        raise
    api('/users', {'id': state['reportUserId'], 'username': 'cms-analytics',
                   'password': state['reportPassword'], 'role': 'user'}, admin)
    reporter = login('cms-analytics', state['reportPassword'])

try:
    api('/websites/' + state['websiteId'], token=reporter)
except urllib.error.HTTPError as error:
    if error.code not in (403, 404):
        raise
    api('/websites', {'id': state['websiteId'], 'name': 'Jelena Rajković',
                      'domain': 'jelena.rajkovic.coach'}, reporter)

# The CMS can only read reports. Its credential never reaches a browser.
api('/users/' + state['reportUserId'], {'role': 'view-only'}, admin)
reporter = login('cms-analytics', state['reportPassword'])
api('/websites/' + state['websiteId'], token=reporter)

env = root / '.env'
lines = env.read_text().splitlines()
values = {
    'UMAMI_USERNAME': 'cms-analytics', 'UMAMI_PASSWORD': state['reportPassword'],
    'UMAMI_WEBSITE_ID': state['websiteId'], 'UMAMI_URL': 'http://umami:3000',
    'ANALYTICS_TRUST_PROXY': 'true', 'COMPOSE_PROFILES': 'analytics',
}
# Refuse conflicts rather than silently replacing another analytics installation.
for key, value in values.items():
    current = next((line.split('=', 1)[1] for line in lines if line.startswith(key + '=')), None)
    if current is not None and current != value:
        raise RuntimeError('Existing analytics setting differs: ' + key)
keys = {line.split('=', 1)[0] for line in lines if '=' in line}
with env.open('a') as f:
    f.write('\n')
    for key, value in values.items():
        if key not in keys:
            f.write(key + '=' + value + '\n')
    if 'ANALYTICS_ENABLED' not in keys:
        f.write('ANALYTICS_ENABLED=false\n')
print('Private reporting configured; default password replaced; CMS account is view-only.')
print('Set ANALYTICS_ENABLED=true only when ready to begin visitor collection.')
