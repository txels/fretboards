run:
	python3 -m http.server 8007

test:
	npm test

publish:
	scp *.{html,js,css} txels.com:fretboard/


.PHONY: setup run test publish
