# script para inserir tags no banco de dados

import urllib.request
import json

names = ["html", "css", "javascript", "python"]

for name in names: 
    data = {
        "name": name
    }
    url = "http://localhost:3000/tag/create"

    data = json.dumps(data).encode('utf-8')

    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

    try:
        with urllib.request.urlopen(req) as f:
            response = f.read()
            print("Data successfully sent to the database.")
    except urllib.error.HTTPError as e:
        print("HTTP Error:", e.code)
    except urllib.error.URLError as e:
        print("URL Error:", e.reason)
