run:
	python3 -m http.server 8007

test:
	npm run test

build:
	npm run build

# bump-micro:
# 	yarn version --micro

# bump-minor:
# 	yarn version --minor

publish: build
	git push --tags
	npm publish
	make publish-demos

publish-demos:
	scp -r demos dist txels.com:fretboard/


.PHONY: run test build bump-micro bump-minor publish publish-demos
