#!/bin/bash

#Create directory if it does not exist
mkdir -p sapdocs

httrack "https://help.sap.com/doc/abapdocu_731_index_htm/7.31/en-US/abenabap.htm" "+*.help.sap.com/doc/*" -v --quiet

httrack "https://help.sap.com/doc/abapdocu_740_index_htm/7.40/en-US/abenabap.htm" "+*.help.sap.com/doc/*" -v --quiet

httrack "https://help.sap.com/doc/abapdocu_754_index_htm/7.54/en-US/abenabap.htm" "+*.help.sap.com/doc/*" -v --quiet