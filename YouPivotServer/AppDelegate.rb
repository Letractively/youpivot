#
#  AppDelegate.rb
#  YouPivotServer
#
#  Created by Abraham Fine on 11/29/11.
#  Copyright 2011 __MyCompanyName__. All rights reserved.
#

class AppDelegate
    attr_accessor :window, :button
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
        
        #backround_image = NSImage.alloc.initByReferencingFile(installScreen.png)
        #[window setBackgroundColor:[NSColor colorWithPatternImage:[NSImage imageNamed:@"myImage.png"]]];
        
        window.setBackgroundColor(NSColor.colorWithPatternImage(NSImage.imageNamed("installScreen.png")))
        
        #        window.setBackgroundColor.colorWithPatternImage.imageNamed(installScreen.png)
        
        
        #Start the web server
        #@web_server = Thread.new{
        #    Rack::Handler::ControlTower::Server.new(Responder.new, {:port => 2122, :host => 'localhost', :concurrent => true }).start
        #}
    end
    
    def applicationWillTerminate(notification)
        
        CouchDBSetupTool.kill
        #@web_server.kill
    end
end

