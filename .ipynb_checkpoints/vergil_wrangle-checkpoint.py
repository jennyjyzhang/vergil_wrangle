import json

with open("2020-10-04T20_00_19.json", "r") as read_file:
    data = json.load(read_file)
    read_file.close()

#put all 0000-4000 level courses in 'undergrad' array
undergrad = []
for course in data:

    courseId = course["course"]["course_identifier"]
    
    if len(courseId) == 9 or len(courseId) == 10:
        if courseId[-4].isdigit():
            if int(courseId[-4]) <= 4:
                #print(courseId)
                undergrad.append(course["course"])

#print(len(undergrad)) 
#print(undergrad[2:3])

timeArr = []
for course in undergrad:
    classes = course["classes"]["class"]
    courseId = course["course_identifier"]
    times = []
    
    for section in classes:
        timesListed = section["days_times"]
        
        for day in timesListed:
            startT = day["mil_time_from"]
            endT = day["mil_time_to"]
            time = [startT, endT]
            times.append(time)

    if len(times) != 0:
        timesdict = {courseId: times}
        timeArr.append(timesdict)
        
#print(len(timeArr))
print(timeArr[0:2])

############################################
#########convert############################
from datetime import datetime, timezone
import pytz
from parse import *

# for tz in pytz.all_timezones:
#     print(tz)


#set standard date as 01-01-2020
standard = "01-01-2020 "
#timezone variables
ny = pytz.timezone('America/New_York')
bj = pytz.timezone('Asia/Shanghai')
la = pytz.timezone('America/Los_Angeles')

def convert(targetZone, time):
    dt = datetime.strptime(time, "%d-%m-%Y %H:%M:%S")
    dt = ny.localize(dt)
    dtconverted = dt.astimezone(targetZone)
    return dtconverted.strftime(fmt)
    
for course in timeArr:
    #getting all course times as individual arrays
    start = list((course.values()))[0][0]
    start = standard + start[0] + ":00"
    
    end = list((course.values()))[0][0]
    end = standard + end[1] + ":00"
    
    print(start + "==" + convert(bj, start))
    print(end + "==" + convert(bj, end))



    
# fmt = "%Y-%m-%d %H:%M:%S %Z%z"
# time = "01-01-2020 18:10"
# dt = datetime.strptime(time, "%d-%m-%Y %H:%M")
# dt = dt.replace(tzinfo = ny)
# dtconverted = dt.astimezone(bj)
# print(dtconverted.strftime(fmt))


# def timeFmt(timeEntry):
#     inputTime = parse(timeEntry).replace(tzinfo=pytz.timezone("US/Eastern"))
#     convTime = inputTime.astimezone(pytz.timezone("Asia/Shanghai"))
#     return convTime


   