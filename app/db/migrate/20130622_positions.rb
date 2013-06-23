class Positions < ActiveRecord::Migration
  def up
    create_table :positions do |t|
      (0...45).each{|i| t.integer "pos#{i}"}
      t.text :ident
      t.integer :total_games
      t.float :average_score
    end
  end

  def down
    drop_table :positions
  end

end
