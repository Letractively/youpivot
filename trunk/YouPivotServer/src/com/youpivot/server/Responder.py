'''
Created on Feb 21, 2011

@author: Abraham Fine
'''

import cherrypy
import couchdb
import urllib
import time

from uuid import uuid4

MANDATORY_ADD_TERMS = ['keyword', 'userid', 'title', 'starttime', 'endtime', 'url', 'favicon', 'developerid', 'eventtypename']
MANDATORY_GET_TERMS = ['pivottime', 'userid']
MANDATORY_END_TERMS = ['eventid', 'endtime']
MANDATORY_DELETE_TERMS = ['eventid']
MANDATORY_UPDATE_TERMS = ['eventid'] 
MANDATORY_SEARCH_TERMS = ['userid', 'string']
DB_SERVER_URL = 'http://admin:youpivot@youpivottest.couchone.com/'
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
        if not self.developerExists(args):
            return 'Invalid Developer'
        #Check to make sure we have the required fields
        if not self.hasRequiredAddTerms(args):
            return 'Missing Fields'
        #Check that the user exists
        if not self.userExists(args):
            return 'Bad User'
        id = self.createDoc(args)
        args['eventid'] = id
        self.addImpVal(args)
        return id
    
    #Called when reading from the db
    @cherrypy.expose()
    def get(self, **args):
        if not self.hasRequiredGetTerms(args):
            return 'Missing Fields'
        #Check that the user exists
        if not self.userExists(args):
            return 'Bad User'
        
        return self.reply(args)
        
    @cherrypy.expose()
    def end(self, **args):
        #Check to make sure we have the required fields
        if not self.hasRequiredEndTerms(args):
            return 'Missing Fields'
        if not self.eventExists(args):
            return 'Bad Event ID'
        self.endEvent(args)
        return 'ended'
     
    #Delete a document   
    @cherrypy.expose()
    def delete(self, **args):
        #Check to make sure we have the required fields
        if not self.hasRequiredDeleteTerms(args):
            return 'Missing Fields'
        if not self.eventExists(args):
            return 'Bad Event ID'
        self.deleteEvent(args)
        return 'deleted'
    
    @cherrypy.expose()
    def update(self, **args):
        #Check to make sure we have the required fields
        if not self.hasRequiredUpdateTerms(args):
            return 'Missing Fields'
        self.addImpVal(args)
        return 'updated'
    
#    @cherrypy.expose()
#    def search(self, **args):
        

    #Evil person prevention
    def developerExists(self, args):
        return args['developerid'] in developersdb
    
    #Check to make sure the user exists
    def userExists(self, args):
        return args['userid'] in usersdb
    
    #Check if an eventid is valid
    def eventExists(self, args):
        return args['eventid'] in eventsdb
    
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
    
    def hasRequiredEndTerms(self, args):
        for mandatoryTerm in MANDATORY_END_TERMS:
            if not mandatoryTerm in args:
                return False
        return True
    
    def hasRequiredDeleteTerms(self, args):
        for mandatoryTerm in MANDATORY_DELETE_TERMS:
            if not mandatoryTerm in args:
                return False
        return True
    
    def hasRequiredUpdateTerms(self, args):
        for mandatoryTerm in MANDATORY_UPDATE_TERMS:
            if not mandatoryTerm in args:
                return False
        return True
    
    #Create the document in the events database
    def createDoc(self, args):
        doc = args
        id = uuid4().hex
        doc['_id'] = id
        doc['endtime'] = int(args['endtime'])
        doc['starttime'] = int(args['starttime'])
        doc['importancevalues'] = {}
        eventsdb.save(doc)
        return id
        
    def reply(self, args):
        time = int(args['pivottime'])
        timeDiff = 12 * 60 * 60
        start = time - timeDiff
        end = time + timeDiff
        url = DB_SERVER_URL + VIEW_LOCATION
        queryString = 'startkey=[' + str(start) + ',"'+ args['userid'] +'"]&endkey=[' + str(end) +',"'+ args['userid'] +'"]'
        url += queryString
        print url
        response = urllib.urlopen(url)
        content = response.read()
        return content

    def endEvent(self, args):
        doc = eventsdb[args['eventid']]
        doc['endtime'] = args['endtime']
        eventsdb.save(doc)
        
    def deleteEvent(self, args):
        doc = eventsdb[args['eventid']]
        eventsdb.delete(doc)
        
    def addImpVal(self, args):
        doc = eventsdb[args['eventid']]
        if not 'importancevalues' in doc:
            doc['importancevalues'] = {} 
        vals = doc['importancevalues']
        
        #Add importance values
        done = False
        counter = 0
        while(not done):
            timeKey = "time" + str(counter)
            valKey = "val" + str(counter)
            if timeKey in args and valKey in args:
                vals[int(args[timeKey])] = float(args[valKey])
                counter = counter + 1
                #del doc[timeKey]
                #del doc[valKey]
            else:
                done = True
        counter = 0
        eventsdb.save(doc) 
        
#Start me up        
cherrypy.quickstart(Responder())

