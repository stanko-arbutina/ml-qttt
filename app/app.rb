$LOAD_PATH.unshift(File.dirname(__FILE__))
require 'rubygems'
require 'sinatra'
require 'sinatra/activerecord'
require 'ar/position'
db = URI.parse(ENV['DATABASE_URL'] || 'postgres://localhost/mydb')

get '/' do
  request.body.rewind
  send_file 'public/index.html'
end

post '/new' do
  request.body.rewind  # in case someone already read it
  position_string, score = request.body.read.split('C')
  score = score.to_f
  positions = position_string.split('A')
  positions.each do |pos|
    candidates = Position.where(:ident => pos)
    if (candidates.any?)
      c = candidates.first
      c.total_games+=1
      c.average_score = (c.average_score + score)/c.total_games
    else
      c = Position.new(:ident => pos, :total_games => 1, :average_score => score)
      fields  = pos.split('B');
      fields.each_with_index{|field,index| c.send("pos#{index}=".to_sym, field.to_i)}
    end
    c.save
  end
end

