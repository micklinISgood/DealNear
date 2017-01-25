
import csv

total_line = set()
with open('api.csv', 'rb') as csvfile:
      spamreader = csv.reader(csvfile, delimiter=',')
      flag = True
      for row in spamreader:
	  if flag:
		flag = False
		continue
          line = row.pop(-1)
	  for num in line.split('\n'):
		
		total_line.add(int(num))
	  

print len( total_line)
