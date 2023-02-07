#!/bin/bash
for file in `ls *.awebp`
do
   mv $file `echo "${file}."png `
done
