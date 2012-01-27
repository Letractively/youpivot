#
#  MainWindowController.rb
#  YouPivotServer
#
#  Created by Abraham Fine on 12/6/11.
#  Copyright 2011 __MyCompanyName__. All rights reserved.
#


class MainWindowController < NSWindowController
    
    def install_cherrypy(sender)
        CouchDBSetupTool.install_cherrypy
    end
    
    def configure_clicked(sender)
        CouchDBSetupTool.perform_setup
    end
    
    def start_server_click(sender)
        CouchDBSetupTool.start_responder
    end
    
    def kill_click(sender)
        CouchDBSetupTool.kill
    end
end