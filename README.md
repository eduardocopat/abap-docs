# ABAP docs

Enhanced ABAP documentation.

## Goals

- Navigable and sharable (i.e. you can open new tabs, instead of the same-page navigation in standard docs).
- Searchable. 
- Comparable across versions.
- Beautiful (e.g. syntax higlight read the docs theme).

## How it works

1. SAP documentation is downloaded using [httrack](http://www.httrack.com/).
2. The documentation is parsed into markdown.
3. The documentation is built with [MkDocs](www.mkdocs.org).
4. The documentation is deployed to GitHub pages.


## Installing and contributing
### Requirements
- Node 12.13.1+
- Python 3.8.1+
- Vagrant 2.2.6+


### Install

- `vagrant up` and then run `./vagrant/sapdocs/download.sh` to download the documentation. This will take hours.
- `pip install -r requirements.txt`
- `npm install` 

### Run
- Run `./build.sh`

## License

ABAP and SAP NetWeaver are Copyright by SAP AG. All rights reserved.

For this repository master branch code, see [License](LICENSE.md)