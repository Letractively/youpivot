#
#  Responder.rb
#  YouPivotServer
#
#  Created by Abraham Fine on 12/6/11.
#  Copyright 2011 __MyCompanyName__. All rights reserved.
#


class Responder
    def call(env)
        [200, {"Content-Type" => "text/plain"}, ["Hello world!"]]
    end
end
