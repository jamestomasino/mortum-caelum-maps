help:
	@echo "targets:"
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	| sed -n 's/^\(.*\): \(.*\)##\(.*\)/  \1|\3/p' \
	| column -t  -s '|'

serve: ## start local webserver for testing
	python3 -m http.server

deploy: build ## send files to webserver
	rsync -rvhe ssh --progress --exclude '.git*' --exclude 'Makefile' --delete ./ tomasino.org:/var/www/map.tomasino.org/

build:
	sass scss:css

.PHONY: serve deploy build

