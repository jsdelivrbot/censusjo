#!/bin/bash
for f in usp_*.sql;
  do
    echo "Processing $f file..";
    sqlplus gispublish/GISPUBLISH@gisdos @$f
  done
