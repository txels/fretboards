run:
	python3 -m http.server 8007

test:
	npm run test

package:
	npm run package

# bump-micro:
# 	yarn version --micro

# bump-minor:
# 	yarn version --minor

publish: package
	git push --tags
	npm publish
	make publish-demos

publish-demos:
	scp -r demos dist txels.com:fretboard/


.PHONY: run test package bump-micro bump-minor publish publish-demos
