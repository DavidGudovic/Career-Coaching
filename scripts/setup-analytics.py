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
                   'password': state['reportPassword'], 'role': 'view-only'}, admin)
    reporter = login('cms-analytics', state['reportPassword'])

# Personal website ownership bypasses Umami's global view-only role. Keep the
# website in an admin-owned team and give the reporter only team-view-only access.
if 'teamId' not in state:
    # Reconcile an interrupted creation before retrying (the API chooses the ID).
    matches = [team for team in api('/teams?pageSize=100', token=admin)['data']
               if team['name'] == 'Private site analytics']
    if len(matches) > 1:
        raise RuntimeError('Multiple private analytics teams; refusing ambiguous setup')
    team = matches[0] if matches else api('/teams', {'name': 'Private site analytics'}, admin)[0]
    state['teamId'] = team['id']
    temporary = state_path.with_suffix('.tmp')
    fd = os.open(temporary, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, 'w') as f:
        json.dump(state, f)
    temporary.replace(state_path)
team_path = '/teams/' + state['teamId']
member_path = team_path + '/users/' + state['reportUserId']
member = api(member_path, token=admin)
if member:
    api(member_path, {'role': 'team-view-only'}, admin)
else:
    api(team_path + '/users', {'userId': state['reportUserId'],
                             'role': 'team-view-only'}, admin)

website_path = '/websites/' + state['websiteId']
website = api(website_path, token=admin)
if not website:
    website = api('/websites', {'id': state['websiteId'], 'name': 'Jelena Rajković',
                               'domain': 'jelena.rajkovic.coach',
                               'teamId': state['teamId']}, admin)
if website.get('teamId') != state['teamId'] or website.get('userId'):
    api(website_path + '/transfer', {'teamId': state['teamId']}, admin)

# The CMS can only read reports. Its credential never reaches a browser.
api('/users/' + state['reportUserId'], {'role': 'view-only'}, admin)
reporter = login('cms-analytics', state['reportPassword'])
api(website_path, token=reporter)
try:
    # A harmless, name-preserving write verifies enforcement, not just role labels.
    api(website_path, {'name': website['name']}, reporter)
except urllib.error.HTTPError as error:
    if error.code not in (401, 403):
        raise
else:
    raise RuntimeError('Reporting account unexpectedly has write access')

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
