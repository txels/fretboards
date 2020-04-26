run:
	python3 -m http.server 8007

test:
	npm test

package:
	npm run package

bump-micro:
	npm version micro

bump-minor:
	npm version minor

publish: package
	npm publish

publish-demos:
	scp -r demos dist txels.com:fretboard/


.PHONY: setup run test publish
