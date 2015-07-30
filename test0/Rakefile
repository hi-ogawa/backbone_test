task :default => [:js, :html]

coffees = FileList.new("**/*.coffee").exclude(/^bower_components/)
hamls = FileList.new("**/*.haml").exclude(/^bower_components/)

task :js   => coffees.ext(".js")
task :html => hamls.ext(".html")

rule '.js' => '.coffee' do |t|
  sh "coffee -c #{t.source}"
end

rule '.html' => '.haml' do |t|
  sh "haml #{t.source} #{t.name}"
end
