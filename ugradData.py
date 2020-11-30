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

#extract each course section's time and max enrollment
alltimeDicts = {}

for course in undergrad:
    courseId = course["course_identifier"]
    
    sections = course["classes"]["class"]
    times = []
    info = {}
    
    for section in sections:
        timesListed = section["days_times"]
        size = section["enrollment"]["max"]
        
        for day in timesListed:
            startT = day["mil_time_from"]
            endT = day["mil_time_to"]
            time = [startT, endT]
            times.append(time)
    
    if len(times) != 0:
        info.update({"size": size})
        info.update({"times": times})
        
    if info:
        alltimeDicts.update({courseId: info})
        
#print(len(alltimeDicts))
#print(alltimeDicts)

#write to json
with open("ugradData.json","w") as write:
    json.dump(alltimeDicts, write, indent = 4)

