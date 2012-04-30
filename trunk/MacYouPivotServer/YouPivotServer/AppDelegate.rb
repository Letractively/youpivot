#
#  AppDelegate.rb
#  YouPivotServer
#
#  Created by Abraham Fine on 11/29/11.
#  Copyright 2011 __MyCompanyName__. All rights reserved.
#

class AppDelegate
    attr_accessor :window, :configurebutton, :startbutton, :mainwindowcontroller
    def applicationDidFinishLaunching(a_notification)
        
        config_file = NSBundle.mainBundle.resourcePath.stringByAppendingPathComponent("couchdbx-core/etc/couchdb/local.ini")
        directory = "~/Library/Application Support/YouPivotServer/CouchData"
        directory = directory.stringByExpandingTildeInPath
        
        lines = IO.readlines(config_file)
        last = lines.last

        if (!last.include?("view_index_dir = " + directory)) then
            puts last
            File.open(config_file, 'a') do |f|  
                f.puts ""
                f.puts "[couchdb]"  
                f.puts "database_dir = " + directory
                f.puts "view_index_dir = " + directory
            end 
        end
        
        window.setBackgroundColor(NSColor.colorWithPatternImage(NSImage.imageNamed("installScreen.png")))
        
        #Check to see if the server has been configured
        file_manager = NSFileManager.alloc.init
        file_exists = file_manager.fileExistsAtPath(directory, true)
        if file_exists then
            configurebutton.setEnabled(false)
            mainwindowcontroller.start_server_click(self)
        end
        
        
    end
        

    
    def applicationWillTerminate(notification)
        
        CouchDBSetupTool.kill
        #@web_server.kill
    end
end

