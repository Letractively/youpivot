'''
    Created on May 7, 2011
    
    @author: Maurice Lam
    '''

import couchdb
import urllib

DB_SERVER_URL = 'http://localhost:5984'
couch = couchdb.Server(DB_SERVER_URL)

def createDB(dbname):
	if dbname in couch:
		print "database `"+dbname+"` already exists"
	else:
		couch.create(dbname)
		print "database `"+dbname+"` created"

createDB('events')
createDB('eventconstants')
createDB('users')
createDB('domain')
createDB('developers')

usersdb = couch['users']
USER_ID = "e34c5ee0d846e882ae1014294b000990"
if USER_ID in usersdb:
	print "Default user already exists"
else:
	usersdb.save({"_id":USER_ID, "name":"Default"})
	print "User `default` created"

devdb = couch['developers']
DEV_ID = "e34c5ee0d846e882ae1014294b002a14"
if DEV_ID in devdb:
	print "Developer `youpivot` already exists"
else:
	devdb.save({"_id": DEV_ID,"name":"youpivot"})
	print "Developer `youpivot` created"

eventsdb = couch['events']
EVENT_ID = "_design/endtimeuserid"
if EVENT_ID in eventsdb:
	print "Design document already exists"
else:
	eventsdb.save({"_id": "_design/endtimeuserid","language": "javascript","views": {"endtimeuserid": {"map": "function(doc) {\n  emit([doc.endtime, doc.userid], doc);\n}"},"temp_search": {"map": "function(doc) {\n if(typeof doc.keyword == 'string') emit([doc.keyword.toLowerCase(), doc.userid], doc); else for(var i in doc.keyword) { emit([doc.keyword[i].toLowerCase(), doc.userid], doc); } \n}"}}})
	print "Design document `endtimeuserid` created"
