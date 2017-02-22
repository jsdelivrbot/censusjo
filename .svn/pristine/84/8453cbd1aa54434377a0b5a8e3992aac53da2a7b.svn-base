#!/bin/bash
for f in 2015*.sql;
  do
    echo "Processing $f file..";
    sqlplus gispublish/GISPUBLISH@orclgis2 @$f
  done
