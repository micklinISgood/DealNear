#!/usr/bin/env python2.7

"""
Columbia W4111 Intro to databases
Example webserver

To run locally

    python server.py

Go to http://localhost:8111 in your browser


A debugger such as "pdb" may be helpful for debugging.
Read about it online.
"""

import os,time,requests,psycopg2,hashlib,re, random
from sqlalchemy import *
# from imagerq import *
from sqlalchemy.pool import NullPool
from flask import Flask, request, render_template, g, jsonify, redirect, Response

tmpl_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
public_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public')
app = Flask(__name__, template_folder=tmpl_dir, static_folder=public_dir,static_url_path='')

import logging

logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
#
# The following uses the postgresql test.db -- you can use this for debugging purposes
# However for the project you will need to connect to your Part 2 database in order to use the
# data
#
# XXX: The URI should be in the format of: 
#
#     postgresql://USER:PASSWORD@<IP_OF_POSTGRE_SQL_SERVER>/postgres
#
# For example, if you had username ewu2493, password foobar, then the following line would be:
#
#     DATABASEURI = "postgresql://ewu2493:foobar@<IP_OF_POSTGRE_SQL_SERVER>/postgres"
#
# Swap out the URI below with the URI for the database created in part 2
host = "104.196.175.120"
password = "q7kfk"
user = "gvc2108"
DATABASEURI  = "postgresql://%s:%s@%s/postgres" % (user, password, host)


#
# This line creates a database engine that knows how to connect to the URI above
#
engine = create_engine(DATABASEURI)


#
# START SQLITE SETUP CODE
#
# after these statements run, you should see a file test.db in your webserver/ directory
# this is a sqlite database that you can query like psql typing in the shell command line:
# 
#     sqlite3 test.db
#
# The following sqlite3 commands may be useful:
# 
#     .tables               -- will list the tables in the database
#     .schema <tablename>   -- print CREATE TABLE statement for table
# 
# The setup code should be deleted once you switch to using the Part 2 postgresql database
#
# engine.execute("""DROP TABLE IF EXISTS test;""")
# engine.execute("""CREATE TABLE IF NOT EXISTS test (
#   id serial,
#   name text
# );""")
# engine.execute("""INSERT INTO test(name) VALUES ('grace hopper'), ('alan turing'), ('ada lovelace');""")
#
# END SQLITE SETUP CODE
#



@app.before_request
def before_request():
  """
  This function is run at the beginning of every web request 
  (every time you enter an address in the web browser).
  We use it to setup a database connection that can be used throughout the request

  The variable g is globally accessible
  """
  try:
    g.conn = engine.connect()
  except:
    print "uh oh, problem connecting to database"
    import traceback; traceback.print_exc()
    g.conn = None

@app.teardown_request
def teardown_request(exception):
  """
  At the end of the web request, this makes sure to close the database connection.
  If you don't the database could run out of memory!
  """
  try:
    g.conn.close()
  except Exception as e:
    pass


#
# @app.route is a decorator around index() that means:
#   run index() whenever the user tries to access the "/" path using a GET request
#
# If you wanted the user to go to e.g., localhost:8111/foobar/ with POST or GET then you could use
#
#       @app.route("/foobar/", methods=["POST", "GET"])
#
# PROTIP: (the trailing / in the path is important)
# 
# see for routing: http://flask.pocoo.org/docs/0.10/quickstart/#routing
# see for decorators: http://simeonfranklin.com/blog/2012/jul/1/python-decorators-in-12-steps/
#

def getPostById(result, data):
    try:
      data["pid"]=result["pid"]
      data["title"]=result["title"]
      data["cr_time"]=result["cr_time"]
      data["status"]=result["status"]
      l_cursor = g.conn.execute("Select name from locations where lid in (Select lid from set_ploc where pid = %s)", result["pid"])
      loc_str = ""
      for locs in l_cursor:
            loc_str += locs["name"]+"; "
      l_cursor.close()
      if len(loc_str) >0 : data["locs"] = loc_str
      l_cursor = g.conn.execute("Select url from  pictures where pid = %s", result["pid"])
      loc_str = ""
      data["pics"]=[]
      for locs in l_cursor:
            data["pics"].append(locs["url"])
      l_cursor.close()
      p_cursor = g.conn.execute("Select amount from set_price where pid = %s order by time desc limit 1", result["pid"])
      data["price"] = float(p_cursor.fetchone()[0])
      w_cursor = g.conn.execute("Select count(*) from (Select uid,pid from watch group by uid,pid having pid =%s) as foo", result["pid"])
      data["watch"] = int(w_cursor.fetchone()[0])
      u_cursor = g.conn.execute("select users.name, users.uid from create_post, users where pid = %s and users.uid=create_post.uid", result["pid"])
      u_row = u_cursor.fetchone()
      data["p_name"] =  u_row["name"] 
      data["p_uid"] = int(u_row["uid"])
      r_cursor = g.conn.execute(" select avg(p) from (select avg(point) as p, from_id from rate where to_id=%s and \
        from_id in (select to_id from sell where from_id=%s) group by from_id) as foo ", u_row["uid"],u_row["uid"])
      tmp_r =  r_cursor.fetchone()["avg"]
      # print tmp_r
      if tmp_r is not None : tmp_r= float(tmp_r)
      # print tmp_r
      data["rate"] = tmp_r
    except:
      pass


@app.route('/')
def index():
  """
  request is a special object that Flask provides to access web request information:

  request.method:   "GET" or "POST"
  request.form:     if the browser submitted a form, this contains the data in the form
  request.args:     dictionary of URL arguments e.g., {a:1, b:2} for http://localhost?a=1&b=2

  See its API: http://flask.pocoo.org/docs/0.10/api/#incoming-request-data
  """

  # DEBUG: this is debugging code to see what request looks like
  print request.args
  print request.user_agent.browser
  print int(time.time())
  print 'Hello, world! running on %s' % request.host
  url = 'http://freegeoip.net/json/'+request.remote_addr
  r = requests.get(url)
  print r.json()
  #
  # example of a database query
  #
  # cursor = g.conn.execute("SELECT name FROM test")
  # names = []
  # for result in cursor:
  #   names.append(result['name'])  # can also be accessed using result[0]
  # cursor.close()

  #
  # Flask uses Jinja templates, which is an extension to HTML where you can
  # pass data to a template and dynamically generate HTML based on the data
  # (you can think of it as simple PHP)
  # documentation: https://realpython.com/blog/python/primer-on-jinja-templating/
  #
  # You can see an example template in templates/index.html
  #
  # context are the variables that are passed to the template.
  # for example, "data" key in the context variable defined below will be 
  # accessible as a variable in index.html:
  #
  #     # will print: [u'grace hopper', u'alan turing', u'ada lovelace']
  #     <div>{{data}}</div>
  #     
  #     # creates a <div> tag for each element in data
  #     # will print: 
  #     #
  #     #   <div>grace hopper</div>
  #     #   <div>alan turing</div>
  #     #   <div>ada lovelace</div>
  #     #
  #     {% for n in data %}
  #     <div>{{n}}</div>
  #     {% endfor %}
  # #
  # context = dict(data = names)


  #
  # render_template looks in the templates/ folder for files.
  # for example, the below file reads template/index.html
  #
  return render_template("index.html")

#
# This is an example of a different path.  You can see it at
# 
#     localhost:8111/another
#
# notice that the functio name is another() rather than index()
# the functions for each app.route needs to have different names
#
@app.route('/another')
def another():
  return render_template("anotherfile.html")


# Example of adding new data to the database
@app.route('/add', methods=['POST'])
def add():
  name = request.form['name']
  print name
  cmd = 'INSERT INTO test(name) VALUES (:name1), (:name2)';
  g.conn.execute(text(cmd), name1 = name, name2 = name);
  return redirect('/')


@app.route('/tag/<path:path>')
def tag(path): 
  

  ret=get_photo_by_name(path)
  cmd = 'INSERT INTO piclib VALUES (:name1,:name2)';
  try:
    for url in ret:

      g.conn.execute(text(cmd), name1 = path, name2 = url);
  except Exception as e:
    print e
  data={}
  data[path]=ret
  return jsonify(data=data)


@app.route('/r/<path:path>')
def rate_seller(path):
  # print path
  x=re.split('[\/]',path)
  data={}
  try:
    pid = int(x[0])
    from_id = int(x[1])
    to_id = int(x[2])
    cursor = g.conn.execute("select * from sell where pid = %s and from_id=%s and to_id=%s",pid,from_id,to_id)
    row = cursor.fetchone()
    if row is not None: 
      cursor = g.conn.execute("select * from users where uid = %s ",from_id)
      u_d = cursor.fetchone()
      data["seller_id"]=u_d["uid"]
      data["seller_name"]=u_d["name"]
      data["buyer_id"]=to_id
      data["pid"]=pid
      return render_template("rate.html", key=data)
  except:
    pass

  return render_template("rate.html", key=data)

@app.route('/p/<path:path>')
def postlink(path):
  # print path
  data={}
  try:
    cursor = g.conn.execute("select * from post where pid = %s",path)
    getPostById(cursor.fetchone(),data)
  except:
    pass
  return render_template("post.html", key=data)

@app.route('/sendMsg', methods=['GET'])
def sendMsg():
  from_id = request.args.get('from_id', -1, type=int)
  to_id = request.args.get('to_id', -1, type=int)
  token = request.args.get('token', "", type=str)
  text = request.args.get('text', "", type=str)
  # print to_id,from_id
  if from_id == -1 or to_id == -1 or text=="" or token=="": return jsonify(data="error")
  cursor = g.conn.execute("Select * from session where uid=%s and location=%s",from_id,token)
  row = cursor.fetchone()
  if row is None: return jsonify(data="error")

  g.conn.execute("INSERT into msg values (%s,%s,%s,%s)",int(time.time()),from_id,to_id,text)

  return jsonify(data="ok")

@app.route('/logout', methods=['GET'])
def logout():
  uid = request.args.get('uid', -1, type=int)
  token = request.args.get('token', "", type=str)

  if uid == -1 or token=="": return jsonify(data="error")
  g.conn.execute("delete from session where uid=%s and location=%s",uid,token)
 
  return jsonify(data="ok")

@app.route('/rateSeller', methods=['GET'])
def rateSeller():
  uid = request.args.get('from_id', -1, type=int)
  to_id = request.args.get('to_id', -1, type=int)
  rate = request.args.get('rate', -1, type=int)
  token = request.args.get('token', "", type=str)
  cursor = g.conn.execute("Select * from session where uid=%s and location=%s",uid,token)
  row = cursor.fetchone()
  if row is None: return jsonify(data="error")

  g.conn.execute("INSERT INTO rate (time, from_id, to_id, point) VALUES (%s, %s, %s, %s);",int(time.time()) ,uid, to_id,rate)
  
  return jsonify(data="ok")

@app.route('/updateUser', methods=['POST'])
def updateUser():

  uid = request.form['uid']
  token = request.form['token']
  cursor = g.conn.execute("Select * from session where uid=%s and location=%s",uid,token)
  row = cursor.fetchone()
  if row is None: return jsonify(data="error")



  for k,v in request.form.items():
    if k=="uid" or k=="token": continue
    g.conn.execute("Update users set "+k+"=%s where uid=%s",v,uid)

  return jsonify(data="ok")

@app.route('/uploadUserloc', methods=['POST'])
def uploadUserloc():

  uid = request.form['uid']
  token = request.form['token']
  lat = request.form['lat']
  lng = request.form['lng']
  loc_name = request.form['loc_name']
  cursor = g.conn.execute("Select * from session where uid=%s and location=%s",uid,token)
  row = cursor.fetchone()
  if row is None: return jsonify(data="error")
  try:
    g.conn.execute("Insert into locations (name, latitude, longitude) values (%s,%s,%s)",loc_name,lat,lng)

    cursor = g.conn.execute("select lid from locations where latitude=%s and longitude=%s",lat, lng)
    lid = cursor.fetchone()[0]
    
    g.conn.execute("Insert into set_uloc (uid, lid, time) values (%s,%s,%s)",uid,lid,int(time.time()))
  except Exception as e:
    print e
  return jsonify(data="ok")

@app.route('/deleteSession', methods=['POST'])
def deleteSession():

  uid = request.form['uid']
  token = request.form['token']
  d_token = request.form['d_token']

  cursor = g.conn.execute("Select * from session where uid=%s and location=%s",uid,token)
  row = cursor.fetchone()
  if row is None: return jsonify(data="error")

  g.conn.execute("delete from session where uid=%s and location=%s",uid,d_token)

  return jsonify(data="ok")

@app.route('/getUser', methods=['GET'])
def getUser():
  uid = request.args.get('uid', -1, type=int)
  token = request.args.get('token', "", type=str)
  cursor = g.conn.execute("Select * from session where uid=%s and location=%s",uid,token)
  row = cursor.fetchone()
  if row is None: return jsonify(data="error")
  
  ret = {}

  cursor = g.conn.execute("Select * from session where uid=%s",uid)
  ret["session"]=[]
  for result in cursor:
      data={}
      data["time"]=result["time"]
      data["type"]=result["type"]
      data["token"]=result["location"]
      ret["session"].append(data)

  cursor = g.conn.execute("Select * from users where uid=%s",uid)
  ret["u_info"]={}
  for result in cursor:
      ret["u_info"]["phone"]=result["phone"]
      ret["u_info"]["name"]=result["name"]
      ret["u_info"]["email"]=result["email"]
      ret["u_info"]["pw"]=result["pw"]
  
  return jsonify(data=ret)

@app.route('/putComment', methods=['POST'])
def putComment():
  uid = request.form['uid']
  token = request.form['token']
  pid = request.form['pid']
  text = request.form['text']
  try:
    cursor = g.conn.execute("Select * from session where uid=%s and location=%s",uid,token)
    row = cursor.fetchone()
    
    if row is None: return jsonify(data="error")

    g.conn.execute("INSERT INTO comment (pid, uid, text,time) VALUES (%s,%s,%s,%s)",pid,uid,text,int(time.time()))

    return jsonify(data="ok")



  except Exception as e:
    print e
    return jsonify(data="error")


@app.route('/getComments', methods=['GET'])
def getComments():
  pid = request.args.get('pid', -1, type=int)

  try:
    cursor = g.conn.execute("Select comment.*, u.uid,u.name from comment, users as u where pid=%s and comment.uid=u.uid order by comment.time asc",pid)
    ret=[]
    for result in cursor:
        data={}
        data["uid"]=result["uid"]
        data["name"]=result["name"]
        data["text"]=result["text"]
        ret.append(data)

    return jsonify(data=ret)

  except Exception as e:
    print e
    return jsonify(data="error")



@app.route('/inbox', methods=['GET'])
def inbox():
  uid = request.args.get('uid', -1, type=int)
  token = request.args.get('token', "", type=str)
  cursor = g.conn.execute("Select * from session where uid=%s and location=%s",uid,token)
  row = cursor.fetchone()
  if row is None: return jsonify(data="error")

  query ="Select msg.*, users.name from (select max(bi.time),bi.to_id from (\
    Select time, to_id as from_id, from_id as to_id, text from msg\
    union\
    Select * from msg ) as bi where bi.from_id = %s group by bi.to_id) as new, users,msg where users.uid=new.to_id and msg.time=new.max and (msg.to_id=new.to_id or msg.from_id=new.to_id) order by new.max desc limit 5;"

  cursor = g.conn.execute(query,uid)
  ret =[]
  for result in cursor:
    data ={}
    data["time"]=result["time"]
    data["text"]=result["text"]
    data["name"]=result["name"]
    if(result["from_id"] != uid):
        data["to_id"]=result["from_id"]
    else:
        data["to_id"]=result["to_id"]
    ret.append(data)  
  cursor.close()

  return jsonify(data=ret)

@app.route('/deleteItem', methods=['GET'])
def deleteItem():

  uid = request.args.get('uid', -1, type=int)
  pid = request.args.get('pid', -1, type=int)
  token = request.args.get('token', "", type=str)
  cursor = g.conn.execute("Select * from session where uid=%s and location=%s",uid,token)
  row = cursor.fetchone()
  if row is None: return jsonify(data="error")

  g.conn.execute("Update post set status=2 where pid=%s",pid)


  return jsonify(data="ok")

@app.route('/markAsSold', methods=['GET'])
def markAsSold():

  from_id = request.args.get('from_id', -1, type=int)
  to_id = request.args.get('to_id', -1, type=int)
  rate = request.args.get('rate', -1, type=int)
  pid = request.args.get('pid', -1, type=int)
  token = request.args.get('token', "", type=str)
  name = request.args.get('name', "", type=str)

  cursor = g.conn.execute("Select * from session where uid=%s and location=%s",from_id,token)
  row = cursor.fetchone()
  if row is None: return jsonify(data="error")

  s_time = int(time.time())

  g.conn.execute("INSERT INTO sell (pid, time, from_id, to_id) VALUES (%s, %s, %s, %s);", pid, s_time ,from_id, to_id)
  g.conn.execute("Update post set status=1 where pid=%s",pid)
  g.conn.execute("INSERT INTO rate (time, from_id, to_id, point) VALUES (%s, %s, %s, %s);",s_time ,from_id, to_id,rate)
  if to_id != 0:
    cursor = g.conn.execute("Select name from users where uid=%s",from_id)
    row = cursor.fetchone()[0]
    url = "http://%s/r/%d/%d/%d"%(request.host,pid,from_id,to_id)
    msg = "Give a rate to "+row +" please \n"+url
    g.conn.execute("INSERT into msg values (%s,%s,%s,%s)",s_time,0,to_id,msg)


  return jsonify(data="ok")


@app.route('/guessBuyer', methods=['GET'])
def guessBuyer():

  uid = request.args.get('uid', -1, type=int)
  token = request.args.get('token', "", type=str)
  cursor = g.conn.execute("Select * from session where uid=%s and location=%s",uid,token)
  row = cursor.fetchone()
  if row is None: return jsonify(data="error")

  cursor = g.conn.execute("select users.uid,users.name from users,(select max(msg.time),from_id from msg where to_id=%s group by from_id) as b where users.uid=b.from_id and users.uid<>0",uid)
  ret =[]
  for result in cursor:
    data ={}
    data["uid"]=result["uid"]
    data["name"]=result["name"]
    ret.append(data)  
  cursor.close()

  return jsonify(data=ret)


@app.route('/updatePrice', methods=['GET'])
def updatePrice():

  uid = request.args.get('uid', -1, type=int)
  pid = request.args.get('pid', -1, type=int)
  price = request.args.get('price', -1, type=float)
  token = request.args.get('token', "", type=str)
  cursor = g.conn.execute("Select * from session where uid=%s and location=%s",uid,token)
  row = cursor.fetchone()
  if row is None: return jsonify(data="error")

  cursor = g.conn.execute("select * from price where amount=%s",price)
  row = cursor.fetchone()
  if row ==None:
      try:
        g.conn.execute("Insert into price (amount) values (%s)",price)
      except:
        pass
  g.conn.execute("Insert into set_price (time, pid, amount) values (%s,%s,%s)",int(time.time()),pid,price)
  return jsonify(data="ok")

@app.route('/userItems', methods=['GET'])
def userItems():

  uid = request.args.get('uid', -1, type=int)
  token = request.args.get('token', "", type=str)
  cursor = g.conn.execute("Select * from session where uid=%s and location=%s",uid,token)
  row = cursor.fetchone()
  if row is None: return jsonify(data="error")



  query ="select post.* from post,create_post as c where c.uid=%s and c.pid=post.pid and post.status <2 order by post.status asc"

  cursor = g.conn.execute(query,uid)
  ret =[]
  for result in cursor:
    data ={}
    getPostById(result, data)
    ret.append(data)  
  cursor.close()

  return jsonify(data=ret)

@app.route('/near_count', methods=['GET'])
def near_count():
  #get parameter from request
  lat = request.args.get('lat', 40.8075355, type=float)
  lng = request.args.get('lng', -73.9625727, type=float)

  _top = lat +0.05
  _bottom = lat -0.05
  _left = lng -0.05
  _right = lng +0.05
  query = "select l.latitude,l.longitude,l.name,n.count from locations as l, (select count(*), pl.lid from set_ploc as pl , post as p where p.pid=pl.pid and p.status=0 and pl.lid IN (select lid from locations where latitude >= %s and longitude >= %s and  latitude <= %s and longitude <= %s) group by pl.lid) as n where n.lid=l.lid;"

  cursor = g.conn.execute(query,_bottom, _left, _top, _right)

  ret =[]
  for result in cursor:
    data ={}
    data["latitude"]=float(result["latitude"])
    data["longitude"]=float(result["longitude"])
    data["name"]=result["name"]
    data["count"]=result["count"]
    ret.append(data)  
  cursor.close()

  return jsonify(data=ret)

@app.route('/near_post', methods=['GET'])
def near_post():
  lat = request.args.get('lat', 1000, type=float)
  lng = request.args.get('lng', 1000, type=float)
  uid = request.args.get('uid', -1, type=int)
  if lat > 90 or lat < -90 or lng >180 or lng <-180: return jsonify(data="input error")
  print uid

  _top = lat +0.01
  _bottom = lat -0.01
  _left = lng -0.01
  _right = lng +0.01

  query ="select * from post where status = 0 and pid IN (\
        select pid from set_ploc where lid IN (\
        select lid from locations where latitude >= %s and \
        longitude >= %s and  latitude <= %s and longitude <= %s )\
        ) order by cr_time desc;"

  cursor = g.conn.execute(query,_bottom, _left, _top, _right)
  ret =[]
  for result in cursor:
    data ={}
    getPostById(result, data)
    ret.append(data)  
  cursor.close()

  return jsonify(data=ret)



@app.route('/login', methods=['POST'])
def login():
    email=request.form['email']
    pw=request.form['pw']

    cursor = g.conn.execute("select * from users where email=%s and pw=%s",email, pw)
    row = cursor.fetchone()
    # print row
    if row != None:
        ltype = request.user_agent.browser
        ltime = int(time.time())
        token = hashlib.sha224(ltype+str(time.time())+row["name"]+request.remote_addr).hexdigest()
        g.conn.execute("INSERT into session values(%s,%s,%s,%s)", row["uid"], ltime ,ltype, token);
        redirect_to_index = render_template('/login_middle.html',data="ok")
        response = app.make_response(redirect_to_index )  
        response.set_cookie('uid',value=str(row["uid"]))
        response.set_cookie('name',value=str(row["name"]))
        response.set_cookie('token',value=token)
        return response
    else:
        return render_template('/login_middle.html',data="error")

@app.route('/signUp', methods=['POST'])
def signUp():
    email=request.form['email']
    pw=request.form['pw']
    name=request.form['name']
    phone=request.form['phone']

    try:
      cursor = g.conn.execute("INSERT INTO users (name, pw, phone, email) VALUES (%s,%s,%s,%s);\
                                select * from users where uid = (select max(uid) from users);", name, pw, phone,email)
      row = cursor.fetchone()
      
      if row != None:
          ltype = request.user_agent.browser
          ltime = int(time.time())
          token = hashlib.sha224(ltype+str(time.time())+row["name"]+request.remote_addr).hexdigest()
          g.conn.execute("INSERT into session values(%s,%s,%s,%s)", row["uid"], ltime ,ltype, token);
          redirect_to_index = render_template('/login_middle.html',data="ok")
          response = app.make_response(redirect_to_index )  
          response.set_cookie('uid',value=str(row["uid"]))
          response.set_cookie('name',value=str(row["name"]))
          response.set_cookie('token',value=token)
          return response
    except:
        return render_template('/login_middle.html',data="error")

@app.route('/post_item', methods=['POST'])
def post_item():
    
    uid = request.form['uid']
    token = request.form['token']
    title=request.form['title']
    price=request.form['price']
    location_dict ={}
    for  k, v in request.form.items():
      if "location" in k:
          x=re.split('[\[\]]',k)
          # print x
          if x[1] not in location_dict.keys():
            location_dict[x[1]]={}
            location_dict[x[1]][x[3]]=v
          else:
            location_dict[x[1]][x[3]]=v

  
    cursor = g.conn.execute("Select * from session where uid=%s and location=%s",uid,token)
    row = cursor.fetchone()
    # print row
    if row != None:
        lids=[]
        for v in location_dict.values():
          print v
          try:
            g.conn.execute("Insert into locations (name, latitude, longitude) values (%s,%s,%s)",v["name"],v["lat"],v["lng"])
          except Exception as e:
            print e
          cursor = g.conn.execute("select lid from locations where latitude=%s and longitude=%s",v["lat"], v["lng"])
          row = cursor.fetchone()[0]
          lids.append(row)

        cr_time = int(time.time())
        cursor = g.conn.execute("Insert into post (title, cr_time, status) values (%s,%s,%s);\
          select max(pid) from post where title=%s and cr_time=%s and status=0",title,cr_time,0,title,cr_time)
        # cursor = g.conn.execute("select max(pid) from post where title=%s and cr_time=%s and status=0",title,cr_time)
        pid = cursor.fetchone()[0]
        for lid in lids:
          g.conn.execute("Insert into set_ploc (lid,pid) values (%s,%s)",lid,pid)
        g.conn.execute("Insert into create_post (uid,pid) values (%s,%s)",uid,pid)
     
        cursor = g.conn.execute("select * from price where amount=%s",price)
        row = cursor.fetchone()
        if row ==None:
            try:
              g.conn.execute("Insert into price (amount) values (%s)",price)
            except:
              pass
        g.conn.execute("Insert into set_price (time, pid, amount) values (%s,%s,%s)",cr_time,pid,price)


        cursor = g.conn.execute("select count(*),tag from piclib group by tag")
        print cursor
        url="http://learnbonds.com/wp-content/uploads/Tesla-Model-S.jpg"
        for row in cursor:
          if row["tag"] in title:
              offset = random.randint(0,row["count"])
              try:
                cursorU = g.conn.execute("select url from piclib where tag=%s limit 1 offset %s",row["tag"],offset)
                url = cursorU.fetchone()[0]
                break
              except:
                pass
        
        
        g.conn.execute("Insert into pictures (pid, url) values (%s,%s)",pid,url)

  
        return render_template('/middle.html',data="post successfully")
    else:

        return render_template('/middle.html',data="error")




if __name__ == "__main__":
  import click

  @click.command()
  @click.option('--debug', is_flag=True)
  @click.option('--threaded', is_flag=True)
  @click.argument('HOST', default='0.0.0.0')
  @click.argument('PORT', default=8111, type=int)
  def run(debug, threaded, host, port):
    """
    This function handles command line parameters.
    Run the server using

        python server.py

    Show the help text using

        python server.py --help

    """

    HOST, PORT = host, port
    print "running on %s:%d" % (HOST, PORT)
    app.run(host=HOST, port=PORT, debug=debug, threaded=threaded)


  run()
