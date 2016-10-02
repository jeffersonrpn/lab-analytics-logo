user, password = 'nazareno', SENHA
from github3 import login
from datetime import datetime, time
g = login(user, password=password)
o = g.organization('analytics-ufcg')

today = (datetime.now() - datetime(1970,1,1)).total_seconds()
start_w = today - 4 * 7 * 24 * 60 * 60

detailed_stats = []
total_commits = 0;
active_repos = 0;

for r in o.repositories():
    commits = 0
    for c in r.commit_activity():
        if (int(c['week']) >= start_w and int(c['week']) < today):
            commits += c['total']
            total_commits += c['total']
    if (commits > 0):
        active_repos += 1
        detailed_stats.append((r.name, commits))

to_save = dict()
to_save['when'] = today
to_save['repos'] = active_repos
to_save['commits'] = total_commits

import json
with open('github-activity.json', 'w') as outfile:
    json.dump(to_save, outfile)
