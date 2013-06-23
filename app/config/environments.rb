#The environment variable DATABASE_URL should be in the following format:
# => postgres://{user}:{password}@{host}:{port}/path
configure :production, :development do
if ENV['DATABASE_URL']
  db = URI.parse(ENV['DATABASE_URL'])
  db_settings = {:adapter => db.scheme == 'postgres' ? 'postgresql' : db.scheme,
	:host => db.host,
	:username => db.user,
	:password => db.password,
	:database => db.path[1..-1],
	:encoding => 'utf8'
  }
else
  db_settings = YAML.load_file("config/database.yml")['development']
end

ActiveRecord::Base.establish_connection(db_settings)
end
