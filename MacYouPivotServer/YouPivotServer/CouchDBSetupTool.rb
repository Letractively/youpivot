#
#  CouchDBSetupTool.rb
#  YouPivotServer
#
#  Created by Abraham Fine on 12/6/11.
#  Copyright 2011 __MyCompanyName__. All rights reserved.
#

#require 'CherryPySetup.m'

class CouchDBSetupTool
    
    @task = NSTask.alloc.init
    @task2 = NSTask.alloc.init
    
    def self.install_cherrypy
        
    end
    
    def self.perform_setup

        setup_tool_path = NSBundle.mainBundle.resourcePath.stringByAppendingPathComponent("setup.py")
#@task = NSTask.alloc.init
        @task.setLaunchPath("/usr/bin/python")
        @task.setArguments([setup_tool_path])
        @task.setCurrentDirectoryPath(NSBundle.mainBundle.resourcePath)
        @task.launch
        

    end
    
    def self.start_responder
        setup_tool_path2 = NSBundle.mainBundle.resourcePath.stringByAppendingPathComponent("Responder.py")
#@task2 = NSTask.alloc.init
        @task2.setLaunchPath("/usr/bin/python")
        @task2.setArguments([setup_tool_path2])
        @task2.setCurrentDirectoryPath(NSBundle.mainBundle.resourcePath)
        @task2.launch
    end
    
    def self.kill
        @task2.terminate
    end
end