import os
import csv

cerealData = os.path.join('Resources', 'cereal_bonus.csv')


with open(cerealData, 'r') as csvfile:
    # Split the data on commas
    csvreader = csv.reader(csvfile, delimiter=',')

    # skip the headers
    next(csvreader, None) 

    for row in csvreader:
        fiber = float(row[7])
        if (fiber >= 5):
            print(" {:.{}f}".format(fiber,2))

           