# Sahyog-App

Sahyog App is an app aimed to help blue collared workers to find jobs in nearby places from their current location. It helps the job seekers to search for ajob or they can simply look for nearby jobs available around their location. This app especially helps female blue collared workers to find jobs around their current location. along with this, users can also post jobs to hire workers.

![](App.gif)

Pre-recuisites before running the app:
1. Please ensure you have Node [https://nodejs.org/en/download/] and Elasticsearch [https://www.elastic.co/downloads/elasticsearch] installed in your system.
2. To use the "Apply" feature in the web-app, make sure you have following settings in your Gmail account :
> Go to Gmail > Click on Settings icon on top right corner >  Click on "See all settings" > Go to "Forwarding and POP/IMAP" section > In "IMAP access" section, select "Enable IMAP".

Follow the instructions for running the web-app:
1. Clone this repository.
2. Start Elasticsearch server on your system. It can be done by running the command ".\elasticsearch.bat" inside bin folder of elasticsearch.
3. Run "npm install".
4. Run "node create_index.js".
5. Run "node put_mapping.js".
6. Run "nodemon App.js" to check if the site loads without any error.
7. Go to "[localhost:3000]".
8. As the landing page appears, If you want to search for a job, please do fill the form with title "For Job Seeker" and if you want to just post a job, you can login with any dummy username and password under the title "For Job Poster".

> Important Note: In the first time setup of the web-app on user's system, the elasticsearch node is empty, so the user has to first make 5 to 6 job postings before using the "Search for jobs", "See jobs around you" or "see jobs for females" feature.

This web-app has 7 main functionalities:
1. The Job seeker can get information on the nearby jobs from his/her current location.
2. The Female Job seekers can get information on the jobs available for females.
3. Job seeker can serach for specific type of jobs on a specific location.
4. Users can post jobs for hiring workers.
5. Job posters can see the jobs they have posted using their user_id.
6. Job posters can delete the jobs that they have posted for a long time.
7. Job seekers can Apply for the jobs they are interested in, by clicking on "Apply" button in the serach results page and this will send a mail to the job poster about the interest of the joob seeker in the job.


