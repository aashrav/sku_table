import datetime
from dateutil.parser import parse

def convert_time(date):
    dic = {1 : 0, 2 : 31, 3 : 59, 4 : 90, 5 : 120, 6 : 151, 7 : 181, 8 : 212, 9 : 243, 10 : 273, 11 : 304, 12 : 334}
    dt = parse(date)
    year = dt.year
    month = dt.month
    day = dt.day
    return year + ((dic[month] + day) / 365)

