import httplib, urllib, base64, json, requests
from config import subscribe

def get_redirected_url(url):
    opener = urllib2.build_opener(urllib2.HTTPRedirectHandler)
    request = opener.open(url)
    return request.url

class microsoft_image():
	"""docstring for microsoft_image"""
	def __init__(self, arg):
		super(microsoft_image, self).__init__()
		self.arg = arg
		
	@staticmethod	
	def get_photo_by_name(query):

		headers = {
		# Request headers
		'Content-Type': 'multipart/form-data',
		'Ocp-Apim-Subscription-Key': subscribe.key,
		}


		params = urllib.urlencode({
		'q':query
		})

		try:
			conn = httplib.HTTPSConnection('api.cognitive.microsoft.com')
			conn.request("POST", "/bing/v5.0/images/search?%s" % params, "{body}", headers)
			response = conn.getresponse()
			data = response.read()

			ret =[]
			data = json.loads(data)
			for link in data["value"]:
				# print link["contentUrl"]
				r = requests.head(link["contentUrl"], allow_redirects=True)
				ret.append(r.url)
				# print get_redirected_url(link["contentUrl"])
			conn.close()

			return ret

		except Exception as e:
			print("[Errno {0}] {1}".format(e.errno, e.strerror))
# print get_photo_by_name("earphone")