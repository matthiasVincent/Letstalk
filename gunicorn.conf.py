# non logging stuff
bind = "0.0.0.0:8001"
#number of workers to spawn
workers = 3
#access log-reports incoming  HTTP requests
accesslog = "/tmp/letstalk-access.log"
#error log - records any error
errorlog = "/tmp/letstalk-error.log"
#whether to send flask output to the error log
capture_output = True
#verbosity of gunicorn error logs
loglevel = "info"
