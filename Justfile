default:
    just --list

run:
    python3 -m http.server 8007

test:
    yarn test

build:
    yarn build

bump-micro:
    yarn version --micro

bump-minor:
    yarn version --minor

publish: build
    git push --tags
    yarn publish
    just publish-demos

publish-demos:
    scp -r demos dist txels.com:fretboard/
