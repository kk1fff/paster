#!/usr/bin/env python3

import sys, http.client, urllib.parse, re

content = ''
usermail = 'kk1fff@patrickz.net'
username = 'Patrick Wang'
host = "paster.patrickz.net"

while True:
    s = sys.stdin.readline()
    if s == '':
        break
    content = content + s

conn = http.client.HTTPConnection(host, 80)
body = urllib.parse.urlencode({'content': content,
                               'username': username,
                               'usermail': usermail})
print("body: " + body)
headers = {"Content-type": "application/x-www-form-urlencoded",
           "Accept": "text/plain"}
conn.request('POST', '/api/paste', body, headers)
    
resp = conn.getresponse()
result = resp.read().decode('utf-8')
conn.close()

# parse returning data
m = re.search(r'ok: ([A-Za-z0-9]+)', result)
print("result: " + result);
if m != None:
    print("View result: http://{0}/{1}".format(host, m.group(1)))
else:
    print("Failure");
