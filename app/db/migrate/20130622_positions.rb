class Positions < ActiveRecord::Migration
  def up
    create_table :positions, {:id => false} do |t|
      (0...45).each{|i| t.integer "pos#{i}"}
      t.string :ident, :limit => 45, :null => false, :unique => true
      t.integer :total_games
      t.float :average_score
    end
    execute "ALTER TABLE positions ADD PRIMARY KEY (ident);"
  end

  def down
    drop_table :positions
  end

end
