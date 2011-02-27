'''
Created on Feb 21, 2011

@author: Abraham Fine
'''

import cherrypy
import couchdb
import urllib

from uuid import uuid4
from time import gmtime

MANDATORY_ADD_TERMS = ['keyword', 'userid', 'title', 'starttime', 'endtime', 'url', 'favicon', 'developerid', 'eventtypename']
MANDATORY_GET_TERMS = ['pivottime', 'userid']
DB_SERVER_URL = 'http://admin:youpivot@localhost:5984/'
VIEW_LOCATION = "events/_design/endtimeuserid/_view/endtimeuserid?"

#Connect to the Couch Server and db's
couch = couchdb.Server(DB_SERVER_URL)
eventsdb = couch['events']
eventconstantsdb = couch['eventconstants']
usersdb = couch['users']
domaindb = couch['domain']
developersdb = couch['developers']

class Responder(object):
    
    #Called when attempting to add to the db
    @cherrypy.expose()
    def add(self, **args):
        #Check for valid developer ID
        if not self.isValidDeveloper(args):
            return 'Invalid Developer'
        #Check to make sure we have the required fields
        if not self.hasRequiredAddTerms(args):
            return 'Missing Fields'
        #Check that the user exists
        if not self.userExists(args):
            return 'Bad User'
        self.createDoc(args)
        return 'Added stuff'
    
    #Called when reading from the db
    @cherrypy.expose()
    def get(self, **args):
        if not self.hasRequiredGetTerms(args):
            return 'Missing Fields'
        #Check that the user exists
        if not self.userExists(args):
            return 'Bad User'
        
        return self.reply(args)
        
    
    #Evil person prevention
    def isValidDeveloper(self, args):
        return args['developerid'] in developersdb
    
    #Check to make sure no necessary terms were left out
    def hasRequiredAddTerms(self, args):
        for mandatoryTerm in MANDATORY_ADD_TERMS:
            if not mandatoryTerm in args:
                return False
        return True
    
    #Check to make sure no necessary terms were left out
    def hasRequiredGetTerms(self, args):
        for mandatoryTerm in MANDATORY_GET_TERMS:
            if not mandatoryTerm in args:
                return False
        return True
    
    #Check to make sure the user exists
    def userExists(self, args):
        return args['userid'] in usersdb
    
    #Create the document in the events database
    def createDoc(self, args):
        doc = args
        doc['_id'] = uuid4().hex
        doc['endtime'] = int(args['endtime'])
        doc['starttime'] = int(args['starttime'])
        eventsdb.save(doc)
        
    def reply(self, args):
        time = int(args['pivottime'])
        elevenHrs = 11 * 60 * 60
        start = time - elevenHrs;
        end = time + elevenHrs;
        url = DB_SERVER_URL + VIEW_LOCATION
        queryString = 'startkey=[' + str(start) + ',"'+ args['userid'] +'"]&endkey=[' + str(end) +',"'+ args['userid'] +'"]'
        url += queryString
        print url
        response = urllib.urlopen(url)
        content = response.read()
        return content

        
#Start me up        
cherrypy.quickstart(Responder())

