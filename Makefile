setup:
	pipenv install && pipenv shell

run:
	python3 -m http.server 8007

test:
	npm test

readme.html: README.md
	grip README.md --export readme.html

publish:
	scp *.{html,js,css} txels.com:fretboard/


.PHONY: setup run test publish
