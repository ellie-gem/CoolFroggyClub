# Web & Database Computing Web Application Project (2023 Semester 1)

A club management system that allows users to browse available clubs, enrol into clubs and events, and receive email notifications on subscribed club notifications. 

### Admins usage: 
- approve and manage club managers through new club applications, subsequently approving or deleting a club via the admin dashboard
### Club managers usage:
- an extension of club members (includes all club members functionalities)
- post private or public club announcements
- create and manage private or public club events
- approve or remove club members via their manager dashboard
- normal member dashboard is also available for club managers so that they can opt to sign up to be a member for other clubs without using a different account
### Club members usage: 
- request to join multiple clubs
- browse private & public club announcements and events that they have a membership in
- browse public club announcements and events that they are not members in via events list or club's dashboard
- opt to subscribe to club notifications via personal email, viewable through email or personal dashboard
### General user:
- view public, past & future club announcements and events
- when joining a club or event, will be redirected to the login page
- sign up page has functionalities to sign up through Google login (OAuth) or directly through the web page, with password authentication and validation featuresCollaborated

## Information on how to run our work
- Ensure that you have Docker Desktop installed.
- There will be a .devcontainer.json configuration file that will allow you to build an image for a container

## Youtube Demonstration link
https://youtu.be/KhKKPFPoOvY

## In root terminal
1. npm install --save mysql
2. npm install bcrypt
3. npm install express
4. npm install express-session
5. npm install google-auth-library
6. npm install jade
7. npm install nodemailer
8. service mysql start
9. mysql < database.sql
10. mysql
11. use coolfroggyclub;
12. npm start (in a separate terminal)

## To log in as normal user
Email: xxxx@gmail.com
Password: test1234!A
User type: Club Member

## To log in as club manager
Email: sygoh2014@gmail.com
Password: test1234!A
User type: Club Manager

## To log in as admin
Email: thosvu2@gmail.com
Password: test1234!A
User type: Admin
