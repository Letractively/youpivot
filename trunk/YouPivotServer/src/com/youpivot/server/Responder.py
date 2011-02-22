'''
Created on Feb 21, 2011

@author: Abraham Fine
'''

import cherrypy
import couchdb

from uuid import uuid4

MANDATORY_ADD_TERMS = ['keyword', 'userid', 'title', 'starttime', 'endtime', 'url', 'favicon', 'developerid', 'eventtypename']
DB_SERVER_URL = 'http://admin:youpivot@127.0.0.1:5984/'

#Connect to the Couch Server and db's
couch = couchdb.Server(DB_SERVER_URL)
eventsdb = couch['events']
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
        if not self.hasRequiredTerms(args):
            return 'Missing Fields'
        #Check that the user exists
        if not self.userExists(args):
            return 'Bad User'
        self.createDoc(args)
        return 'Added stuff'
    
    #Called when reading from the db
    @cherrypy.expose()
    def get(self, **args):
        return 0
    
    #Evil person prevention
    def isValidDeveloper(self, args):
        return args['developerid'] in developersdb
    
    #Check to make sure no necessary terms were left out
    def hasRequiredTerms(self, args):
        for mandatoryTerm in MANDATORY_ADD_TERMS:
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
        eventsdb.save(doc)
        
        
#Start me up        
cherrypy.quickstart(Responder())
