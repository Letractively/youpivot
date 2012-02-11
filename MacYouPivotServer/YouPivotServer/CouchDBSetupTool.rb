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
    
    @couchDBManager = CouchDBManager.alloc.init
    
    def self.install_cherrypy
        
    end
    
    def self.perform_setup

        directory = "~/Library/Application Support/YouPivotServer/CouchData"
        directory = directory.stringByExpandingTildeInPath

        File.open(NSBundle.mainBundle.resourcePath.stringByAppendingPathComponent("couchdbx-core/etc/couchdb/local.ini"), 'a') do |f|  
            f.puts ""
            f.puts "[couchdb]"  
            f.puts "database_dir = " + directory
            f.puts "view_index_dir = " + directory
        end 
        
        @couchDBManager.startServer

        setup_tool_path = NSBundle.mainBundle.resourcePath.stringByAppendingPathComponent("setup.py")
#@task = NSTask.alloc.init
        @task.setLaunchPath("/usr/bin/python")
        @task.setArguments([setup_tool_path])
        @task.setCurrentDirectoryPath(NSBundle.mainBundle.resourcePath)
        @task.launch
        

    end
    
    def self.start_responder

        @couchDBManager.startServer

        setup_tool_path2 = NSBundle.mainBundle.resourcePath.stringByAppendingPathComponent("Responder.py")
#@task2 = NSTask.alloc.init
        @task2.setLaunchPath("/usr/bin/python")
        @task2.setArguments([setup_tool_path2])
        @task2.setCurrentDirectoryPath(NSBundle.mainBundle.resourcePath)
        @task2.launch

        
        
    end
    
    def self.kill
        @couchDBManager.killServer
        @task2.interrupt
    end
end