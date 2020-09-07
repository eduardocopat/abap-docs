#!/bin/bash

#Create directory if it does not exist
mkdir -p sapdocs

httrack "https://help.sap.com/doc/abapdocu_731_index_htm/7.31/en-US/abenabap.htm" -O "./sapdocs" "+*.help.sap.com/doc/*" -v