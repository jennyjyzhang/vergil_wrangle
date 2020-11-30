from datetime import datetime, timezone
import pytz
from parse import *
import json

with open("ugradData.json", "r") as read_file:
    ugrad = json.load(read_file)
    read_file.close()
    
# for tz in pytz.all_timezones:
#     print(tz)

#set standard date as 01-01-2020
standard = "01-01-2020 "

fmt = "%H:%M"

#timezone variables
ny = pytz.timezone('America/New_York')
bj = pytz.timezone('Asia/Shanghai')
la = pytz.timezone('America/Los_Angeles')

def convert(targetZone, timeStr):
    dt = datetime.strptime(timeStr, "%d-%m-%Y %H:%M:%S")
    dt = ny.localize(dt)
    dtconverted = dt.astimezone(targetZone)
    return dtconverted.strftime(fmt)

bjArr = []
bjStartArr = []
for course in ugrad:
    for time in ugrad[course]["times"]:
        start = time[0]
        start = standard + start + ":00"

        end = time[1]
        end = standard + end + ":00"
    
    bjStartArr.append(convert(bj, start))
    bjArr.append([convert(bj, start), convert(bj, end)])

#print(bjArr)
#print(bjStartArr)
