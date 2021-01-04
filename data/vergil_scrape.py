import boto3
import json
import os

# Connect to S3 ("Simple Storage Service") which stores all our scraper data
session = boto3.Session(profile_name='spec-graphics')
s3 = session.resource('s3')

# Connect to the bucket that holds the Vergil data
bucket = s3.Bucket('vergil-scraper')

# List all the archive filenames, e.g. Fall2020/2020-09-17.json, Spring2021/2020-09-17.json
archives = [o for o in bucket.objects.all()]

def get_archive(semester, date):
    '''
    This function retrieves data that was archived on a particular date
    from a particular semester.
    '''

    # Get the first archive whose filename matches the requested semester and date
    archive = [o for o in archives if semester in o.key and date in o.key][0]
    return json.loads(archive.get()['Body'].read())

def main():
    semesters = ['Fall2019', 'Spring2020', 'Fall2020', 'Spring2021']
    dates = ['2019-09-13', '2020-01-29', '2020-09-18', '2021-01-04']

    for i in range(len(semesters)):
        semester = semesters[i]
        date = dates[i]
        archive = get_archive(semester, date)
        print(f'As of {date}, there were {len(archive)} courses for the semester {semester}.')

        file_name = date + '.json'
        file_path = os.path.join(semester, file_name)
        if not os.path.exists(semester):
            os.makedirs(semester)
        with open(file_path, 'w') as fp:
            json.dump(archive, fp)

main()
