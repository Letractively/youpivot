#
#  CouchDBSetupTool.rb
#  YouPivotServer
#
#  Created by Abraham Fine on 12/6/11.
#  Copyright 2011 __MyCompanyName__. All rights reserved.
#


class CouchDBSetupTool
    
    def self.install_cherrypy
        
    end
    
    def self.perform_setup
        setup_tool_path = NSBundle.mainBundle.resourcePath.stringByAppendingPathComponent("setup.py")
        @task = NSTask.alloc.init
        @task.setLaunchPath("/usr/bin/python")
        @task.setArguments([setup_tool_path])
        @task.launch
        

    end
    
    def self.start_responder
        setup_tool_path2 = NSBundle.mainBundle.resourcePath.stringByAppendingPathComponent("Responder.py")
        @task2 = NSTask.alloc.init
        @task2.setLaunchPath("/usr/bin/python")
        @task2.setArguments([setup_tool_path2])
        @task2.launch
    end
    
    def self.kill
        @task.terminate
        @task2.terminate
    end
end