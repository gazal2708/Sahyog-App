# Sahyog-App

Sahyog App is an app aimed to help blue collared workers to find jobs in nearby places from their current location. It helps the job seekers to search for ajob or they can simply look for nearby jobs available around their location. This app especially helps female blue collared workers to find jobs around their current location. along with this, users can also post jobs to hire workers.

Pre-recuisites before running the app:
1. Please ensure you have Node [https://nodejs.org/en/download/] and Elasticsearch [https://www.elastic.co/downloads/elasticsearch] installed in your system.
2. To use the "Apply" feature in the web-app, make sure you have following settings in your Gmail account :
> Go to Gmail > Click on Settings icon on top right corner >  Click on "See all settings" > Go to "Forwarding and POP/IMAP" section > In "IMAP access" section, select "Enable IMAP".

Follow the instructions for running the web-app:
1. Clone this repository.
2. Start Elasticsearch server on your system. It can be done by running the command "cd .\elasticsearch.bat" inside bin folder of elasticsearch.
3. Run "npm install".
4. Run "node create_index.js".
5. Run "node put_mapping.js".
6. Run "nodemon App.js" to check if the site loads without any error.
7. Go to "[localhost:3000]".
8. As the landing page appears, If you want to search for a job, please do fill the form with title "For Job Seeker" and if you want to just post a job, you can login with any dummy username and password under teh title "For Job Poster".
