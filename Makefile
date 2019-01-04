install:
	pipenv install && pipenv shell

run:
	python3 -m http.server 8080

test:
	npm test

readme.html: README.md
	grip README.md --export readme.html

publish:
	scp *.{html,js,css} txels.com:fretboard/
