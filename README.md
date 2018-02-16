# Bard
Fetches league of legends data from http://www.lolskill.net/

# Usage
This code is meant to run with Node.js, like that:
```
node main.js -l 3 -r euw -t 3v3
```
# Arguments
The script accepts three different arguments. All of then are optional.

### limit (--limit or -l)
The maximum number of results you expect. the default value is 1.

### region (--region or -r)
Fetch data from this region only. This check is not case sensitive and you don't need to match the whole region key.

### type (--type or -t)
Fetch data from this game type / mode. also not case sensitive.

# Dependencies
This project relies on some libraries. Run `npm install` to get them all!
