#=============================================================================
#  Project:    Multivio - https://www.multivio.org/
#  Copyright:  (c) 2009-2011 RERO
#  License:    See file COPYING
#=============================================================================

# proxy server - production
proxy '/server',
   :url => '/server.test',
   :to => 'demo.multivio.org'

# proxy server - test
proxy '/server.test',
   :url => '/server.test',
   :to => 'demo.multivio.org'

# proxy server - local development
proxy '/local',
   :url => '/local',
   :to => 'localhost:4041'

# required libraries
mode :all do
 config :all,
   :required => [:sproutcore, :ki, "sproutcore/ace"],
   :theme_name => 'sc-theme mvo-dark-gray-theme',
	 :load_fixtures => true
end

# URL prefix - production
mode :prod do
 config :all,
   :url_prefix => 'multivio/client'
end

# URL prefix - test
mode :test do
 config :all,
   :url_prefix => 'multivio/client_test'
end
