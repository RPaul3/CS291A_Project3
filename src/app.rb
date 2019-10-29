require 'sinatra'
require 'jwt'
require 'sinatra/cross_origin'
require 'securerandom'
set :server, :thin

configure do
	enable :cross_origin
end

#used for storing msg history
class RingBuffer < Array
  attr_reader :max_size

  def initialize(max_size, enum = nil)
    @max_size = max_size
    enum.each { |e| self << e } if enum
  end

  def <<(el)
    if self.size < @max_size || @max_size.nil?
      super
    else
      self.shift
      self.push(el)
    end
  end

  alias :push :<<
end



#set :root, 'lib/app'

userRecords = Hash.new
ENV['JWT_SECRET'] = 'someawesomesecret'
connections = []
users = []
userConnections = Hash.new
msgHist = RingBuffer.new(100)
msgHist << {"data" => {"created" => Time.now, "status" => "started" }.to_json,
				           "event" => "ServerStatus", 
				           "id" => SecureRandom.uuid
				           }

def encode username
  JWT.encode payload(username), ENV['JWT_SECRET'], 'HS256'
end

def payload username
  {
    exp: Time.now.to_i + 60 * 60,
    data: { username: username },
    nbf: Time.now.to_i
  }
end

def decode token
	begin
		decoded_token = JWT.decode token, ENV['JWT_SECRET'], true, { algorithm: 'HS256' }
		true
	rescue StandardError => e
		false
	end
end

before do
    response.headers['Access-Control-Allow-Origin'] = '*'
end

options "*" do
	response.headers["Allow"] = "GET, PUT, POST, DELETE, OPTIONS"
	response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept, X-User-Email, X-Auth-Token, HTTP_LAST_EVENT_ID"
	response.headers["Access-Control-Allow-Origin"] = "*"
	200
end


post '/login' do

	if !params[:username] || !params[:password]
		status 422
		body "username or password blank\n"
	
	else
		#a new user 
		if !userRecords[params[:username]]  
			userRecords[params[:username]] =  params[:password]
			status 201
			content_type 'application/json'
			{ :token => encode(params[:username]) }.to_json

		else
			#username and password don't match
			if userRecords[params[:username]] != params[:password]
				status 403
				body "Wrong password or username\n"
			else
				user = params[:username]
				#success login
				status 201
				content_type 'application/json'
				{ :token => encode(params[:username]) }.to_json
				
			end
		end
	end
end



post '/message' do
	if !params[:message]
		status 422
		body "empty message"
	else 
		if !request.env["HTTP_AUTHORIZATION"]
			status 403
			body "token empty\n"
		else
			token = request.env["HTTP_AUTHORIZATION"].split()[1]
			if decode(token)
				  decoded_token = JWT.decode token, ENV['JWT_SECRET'], true, { algorithm: 'HS256' }
			      user = decoded_token[0]["data"]["username"]
				  connections.each do |out|
				    msg = {"data" => {"created" => Time.now, "message" => params[:message], "user" => user }.to_json,
				           "event" => "Message", 
				           "id" => SecureRandom.uuid
				           }
             		out << msg.to_json.gsub('\\', '') + "\n"
             		 
				  end
  				body "message received\n"
				status 201
			else
				status 403
				body "token invalid\n"
			end
		end
	end
end




get '/stream/:token', provides: 'text/event-stream' do
	if !params[:token]
		status 403
		body "token empty\n"
	else
		token = params[:token]
		if decode(token)
			decoded_token = JWT.decode token, ENV['JWT_SECRET'], true, { algorithm: 'HS256' }
			user = decoded_token[0]["data"]["username"]
			puts user
			

			#check if user is already connected, if so, disconnect the first conncection
			if userConnections[user]

				#close old conn and send disconnect msg
				msg = {"data" => {"created" => Time.now}.to_json,
				           "event" => "Disconnect", 
				           "id" => SecureRandom.uuid
				      }
				userConnections[user] << msg.to_json.gsub('\\', '') + "\n\n"
				userConnections[user].close
				connections.delete(userConnections[user])
				userConnections.delete(user)
				msgHist << msg

				#start a new connection for that user
				stream(:keep_open) do |out|
					connections << out
					userConnections[user] = out
					EventMachine::PeriodicTimer.new(20) { out << "\0" }
					#handle user parts
	             	out.callback do
					      puts user + ' stream closed'
					      connections.delete(out)
					      userConnections.delete(user)
					      users.delete(user)
					      id = SecureRandom.uuid
					      time = Time.now
		      			  connections.each do |rest|
		      			  	  msg = {"data" => {"created" => time, "user" => user}.to_json,
						             "event" => "Part", 
						             "id" => id
						      }

							rest << "event:Part\n" + "data:" + ({"created" => time, "user" => user}.to_json) + "\n" + "id:#{id}\n\n"
							msgHist << msg
							
						  end
				    end
				end
			

			else
					#broadcast join event to all connected users
					id = SecureRandom.uuid
					time = Time.now
					msg = {"data" => {"created" => time, "user" => user}.to_json,
						           "event" => "Join", 
						           "id" => id
						      } 
					connections.each do |out|	
		         		out << "event:Join\n" + "data:" + ({"created" => time, "user" => user}.to_json) + "\n" + "id:#{id}\n\n"		
					end
					msgHist << msg
				

				#Give a list of users to new connected user
				stream(:keep_open) do |out|
					connections << out
					userConnections[user] = out
					EventMachine::PeriodicTimer.new(20) { out << "\0" }

					id = SecureRandom.uuid
					time = Time.now
					msg = {"data" => {"created" => time, "users" => userConnections.keys}.to_json,
					           "event" => "Users", 
					           "id" => id
					      }
					out << "event:Users\n" + "data:" + ({"created" => time, "users" => userConnections.keys}.to_json) + "\n" + "id:#{id}\n\n"	
					msgHist << msg

	         		

	             	#handle user parts
	             	out.callback do
					      puts user + ' stream closed'
					      connections.delete(out)
					      userConnections.delete(user)
					      users.delete(user)
					      id = SecureRandom.uuid
						  time = Time.now
		      			  connections.each do |rest|
		      			  	  msg = {"data" => {"created" => time, "user" => user}.to_json,
						             "event" => "Part", 
						             "id" => id
						      }

							rest << "event:Users\n" + "data:" + ({"created" => time, "user" => user}.to_json) + "\n" + "id:#{id}\n\n"
							msgHist << msg
							
						  end
				    end
				end
			end

			


		else
			status 403
			body "token invalid\n"
		end

	end
end




