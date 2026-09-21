import urllib.request
import json

print("Verificando chat endpoint...")

try:
    data = json.dumps({'message': 'hotel'}).encode('utf-8')
    req = urllib.request.Request('http://localhost:8000/api/v1/chat/message', data=data, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req) as response:
        result = response.read().decode()
        print("SUCCESS - Chat funcionando:")
        print(result)
except Exception as e:
    print("ERROR:", str(e))