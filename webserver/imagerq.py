import httplib, urllib, base64, json, requests
from config import *

def get_redirected_url(url):
    opener = urllib2.build_opener(urllib2.HTTPRedirectHandler)
    request = opener.open(url)
    return request.url

headers = {
    # Request headers
    'Content-Type': 'multipart/form-data',
    'Ocp-Apim-Subscription-Key': key,
}

params = urllib.urlencode({
	'q':'cats',
	'count':'10'
})

try:
    conn = httplib.HTTPSConnection('api.cognitive.microsoft.com')
    conn.request("POST", "/bing/v5.0/images/search?%s" % params, "{body}", headers)
    response = conn.getresponse()
    data = response.read()
  
    data = json.loads(data)
    for link in data["value"]:
    	# print link["contentUrl"]
		r = requests.head(link["contentUrl"], allow_redirects=True)
		print(r.url)
		# print get_redirected_url(link["contentUrl"])
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))