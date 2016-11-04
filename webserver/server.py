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

import os,time,requests,psycopg2
from sqlalchemy import *
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

@app.route('/inbox', methods=['GET'])
def msg():
  uid = request.args.get('uid', 3, type=int)

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


@app.route('/near_count', methods=['GET'])
def near_count():
  #get parameter from request
  lat = request.args.get('lat', 40.8075355, type=float)
  lng = request.args.get('lng', -73.9625727, type=float)

  _top = lat +0.05
  _bottom = lat -0.05
  _left = lng -0.05
  _right = lng +0.05
  query = "select l.latitude,l.longitude,l.name,n.count from locations as l, (select count(*), pl.lid from set_ploc as pl where pl.lid IN (select lid from locations where latitude >= %s and longitude >= %s and  latitude <= %s and longitude <= %s) group by pl.lid) as n where n.lid=l.lid;"

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


@app.route('/login')
def login():
    abort(401)
    this_is_never_executed()


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
