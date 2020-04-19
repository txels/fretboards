run:
	python3 -m http.server 8007

test:
	npm test

package:
	npm run package

publish: package
	npm publish

publish-demos:
	scp *.{html,js,css} txels.com:fretboard/



.PHONY: setup run test publish
