$LOAD_PATH.unshift(File.dirname(__FILE__))
require 'rubygems'
require 'nokogiri'
CURRENT_DIR = Dir.pwd
learners = "#{CURRENT_DIR}/rapidminer/learners"
apply_model = "#{CURRENT_DIR}/rapidminer/apply_model"
queries = "#{CURRENT_DIR}/rapidminer/queries"
models = "#{CURRENT_DIR}/rapidminer/models"
results = "#{CURRENT_DIR}/rapidminer/results"

Dir.entries(learners).reject{|e| e.start_with? '.'}.each do |entry|
  doc  = Nokogiri::XML(File.read("#{learners}/#{entry}"))
  node = doc.xpath("//parameter[@key='model_file']").first
  node['value'] = "#{models}/#{entry}"
  File.write("#{learners}/#{entry}", doc)
end

Dir.entries(apply_model).reject{|e| e.start_with? '.'}.each do |entry|
  doc  = Nokogiri::XML(File.read("#{apply_model}/#{entry}"))
  node = doc.xpath("//parameter[@key='file']").first
  node['value'] = "#{queries}/#{entry}"

  node = doc.xpath("//parameter[@key='model_file']").first
  node['value'] = "#{models}/#{entry}"

  node = doc.xpath("//parameter[@key='csv_file']").first
  node['value'] = "#{queries}/#{entry.split('.').first}.csv"


  File.write("#{apply_model}/#{entry}", doc)
end
