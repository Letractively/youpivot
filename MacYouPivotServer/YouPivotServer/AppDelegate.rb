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
        @couchDBManager = CouchDBManager.alloc.init
        @couchDBManager.startServer
        
        #Start the web server
        #@web_server = Thread.new{
        #    Rack::Handler::ControlTower::Server.new(Responder.new, {:port => 2122, :host => 'localhost', :concurrent => true }).start
        #}
    end
    
    def applicationWillTerminate(notification)
        @couchDBManager.killServer
        CouchDBSetupTool.kill
        #@web_server.kill
    end
end
