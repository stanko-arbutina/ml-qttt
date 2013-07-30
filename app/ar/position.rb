class Position < ActiveRecord::Base
  attr_accessible :ident, :total_games, :average_score
  self.primary_key = :ident
end
