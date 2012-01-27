#
#  CouchDBManager.rb
#  YouPivotServer
#
#  Created by Abraham Fine on 11/29/11.
#  Copyright 2011 __MyCompanyName__. All rights reserved.
#

framework 'foundation'

class CouchDBManager

    def init
        if super
            @couchPath = NSBundle.mainBundle.resourcePath.stringByAppendingPathComponent("Couchbase Single Server.app/Contents/MacOS/Couchbase Single Server")
            @task = NSTask.alloc.init
            @task.setLaunchPath(@couchPath)
            self
        end
    end
    
    def dealloc
        @couchPath.release
        @task.release
    end
    
    def startServer
        @task.launch
    end
    
    def killServer
        @task.terminate
    end
    
end