#!/usr/bin/env python3

import sys, http.client, urllib.parse, re

usermail = 'kk1fff@patrickz.net'
username = 'Patrick Wang'
# host = ("localhost", 5000)
host = ("paster.patrickz.net", 80)

content = sys.stdin.read()
conn = http.client.HTTPConnection(host[0], host[1])
body = urllib.parse.urlencode({'content':  content,
                               'username': username,
                               'usermail': usermail})
headers = {"Content-type": "application/x-www-form-urlencoded",
           "Accept": "text/plain"}
conn.request('POST', '/api/paste', body, headers)
    
resp = conn.getresponse()
result = resp.read().decode('utf-8')
conn.close()

# parse returning data
m = re.search(r'ok: ([A-Za-z0-9]+)', result)
if m != None:
    print("View result: http://{0}{1}/{2}".format(host[0],
                                                  "" if host[1] == 80 else ":" + str(host[1]),
                                                  m.group(1)))
else:
    # fail, see if we can parse the error message.
    m = re.search(r'fail: ([^\n]+)', result)
    if m != None:
        print("Failure: " + m.group(1))
    else:
        print("Failure");
