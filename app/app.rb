# -*- coding: undecided -*-
$LOAD_PATH.unshift(File.dirname(__FILE__))
require 'rubygems'
require 'sinatra'
require 'sinatra/activerecord'
require 'ar/position'
require 'json'
require 'nokogiri'
require 'csv'

CURRENT_DIR = Dir.pwd
RAPIDMINER_DIR = File.read("#{CURRENT_DIR}/config/rapidminer_path.txt").strip
db = URI.parse(ENV['DATABASE_URL'] || 'postgres://localhost/mydb')

get '/' do
  request.body.rewind
  send_file 'public/index.html'
end


post '/polynomial' do
  request.body.rewind 
  positions = request.body.read.split('#')

  builder = Nokogiri::XML::Builder.new do |xml|
     xml.root {
       positions.each do |pos|
        xml.position do 
          pos.split('D').first.split('').each_with_index{|c,i| xml.send("pos#{i}",c)}
        end
      end
    }
  end
  File.open('rapidminer/queries/polynomial.xml','wb') do |file|
     file << builder.to_xml
  end
  system "#{RAPIDMINER_DIR}/scripts/rapidminer -f #{CURRENT_DIR}/rapidminer/apply_model/polynomial.xml"
  arr = []
  CSV.foreach "rapidminer/results/polynomial.csv" do |row|
    arr << row.to_s.split(';').last
  end
  arr.join('#')            
end


post '/naive' do
  request.body.rewind 
  positions = request.body.read.split('#').map{|c| c.split('D').first}
  arr = [];
  positions.each do |pos_ident|
    candidates = Position.where(:ident => pos_ident)
    if candidates.any?
      arr << candidates.first.average_score
    else 
      arr << 'N/A'
    end
  end
  arr.join('#');
end


post '/new' do
  request.body.rewind  # in case someone already read it
  position_string, score = request.body.read.split('C')
  score = score.to_f
  positions = position_string.split('A')
  positions.each_with_index do |pos1,i|
    pos, wins = pos.split('D')
    #wins je string s 9 brojeva odvojenih s '|', kvazi snage pobjedničkih linija za igrače, gurnuti u nn zajedno s velikim pozicijama
    tscore = score/(positions.size-i)
    candidates = Position.where(:ident => pos)
    if (candidates.any?)
      c = candidates.first
      c.total_games+=1
      c.average_score = (c.average_score + tscore)/c.total_games
    else
      c = Position.new(:ident => pos, :total_games => 1, :average_score => tscore)
      fields  = pos.split('');
      fields.each_with_index{|field,index| c.send("pos#{index}=".to_sym, field.to_i)}
    end
    c.save
  end
end

