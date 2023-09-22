// Get the value of the 'event_id' or 'post_id' query parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
let eventID = null;
let postID = null;

if (urlParams.has('event_id')) {
  eventID = urlParams.get('event_id');
} else if (urlParams.has('post_id')) {
    postID= urlParams.get('post_id');
}

const vueinst = Vue.createApp({
    data() {
        return {
            signedIn: false,
            buttonHover: false,

            // details needed for editing event details
            event_name: '',
            event_message: '',
            event_date: null,
            event_location: '',
            privacy: '',

            // details for original event details (details needed for editing event details)
            originEventName: '',
            originEventMessage: '',
            originEventDate: '',
            originEventLocation: '',
            originPrivacy: '',

            // details for changing news details
            newsTitle: '',
            newsMessage: '',
            newsPrivacy: '',

            // details for original news details
            originNewsTitle: '',
            originNewsMessage: '',
            originNewsPrivacy: '',

            // details for original
            club_id: '',
            club_name: '',
            club_email: '',
            club_description: '',
            club_phone: '',

            // details for editing club
            new_club_name: '',
            new_club_email: '',
            new_club_description: '',
            new_club_phone: '',

            // to toggle menu bar
            menu: 'hamburger',
            dropdown: 'dropdown-menu',
        };
    },

    computed: {
        URL: function () {
            // If user is signed in, change log in button to account button
            if (this.signedIn === false) {
                return "login-new.html";
            } else {
                return 'member-profile.html';
            }
        },
        buttonName: function () {
            // If user is signed in
            if (this.signedIn === true) {
                return "Account";
            } else {
                return "Log in/Sign up";
            }
        }
    },

    methods: {
        formatDate: function(date) {
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric"
            };

            return new Date(date).toLocaleDateString(undefined, options);
        },

        // functions to edit event details
        view_old_info: function(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if ( req.readyState === 4  && req.status === 200) {
                    let result = JSON.parse(req.response)[0];
                    vueinst.originEventName = result.event_name;
                    vueinst.originEventDate = result.event_date;
                    vueinst.originEventLocation = result.event_location;
                    vueinst.originEventMessage = result.event_message;

                    let isPrivate = result.private_event;
                    if (isPrivate === 1) {
                        vueinst.originPrivacy = 'private';
                        vueinst.privacy = 'private';
                    } else {
                        vueinst.originPrivacy = 'public';
                        vueinst.privacy = 'public';
                    }

                    vueinst.event_name = result.event_name;
                    vueinst.event_date = result.event_date;
                    vueinst.event_location = result.event_location;
                    vueinst.event_message = result.event_message;
                }
            };

            req.open('POST', "/club_managers/viewEventDetails", true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify({
                event_id: eventID
            }));
        },

        update_info: function(){
            let isPrivate;
            if (vueinst.privacy === 'private') {
                isPrivate = '1';
            } else {
                isPrivate = '0';
            }

            let req = new XMLHttpRequest();

            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.event_name = '';
                    vueinst.event_message = '';
                    vueinst.event_date = '';
                    vueinst.event_location = '';
                    vueinst.privacy = '';
                    alert('Event details changed sucessfully');
                    window.location.href = "club-manager-profile.html";
                } else if (this.readyState == 4 && this.status == 401) {
                    alert('Cannot change event details');
                }
            };

            req.open('POST', '/club_managers/updateEvent', true);
            req.setRequestHeader("Content-type", "application/json");

            req.send(JSON.stringify({
                event_name: vueinst.event_name,
                event_message: vueinst.event_message,
                event_date: vueinst.event_date,
                event_location: vueinst.event_location,
                privacy: isPrivate,
                event_id: eventID
            }));
        },

        // Functions to edit news details
        view_old_news: function(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if ( req.readyState === 4  && req.status === 200) {
                    let result = JSON.parse(req.response)[0];
                    vueinst.originNewsTitle = result.title;
                    vueinst.originNewsMessage = result.post_message;

                    let isPrivate = result.private_message;
                    if (isPrivate === 1) {
                        vueinst.originNewsPrivacy = 'private';
                        vueinst.newsPrivacy = 'private';
                    } else {
                        vueinst.originNewsPrivacy = 'public';
                        vueinst.newsPrivacy = 'public';
                    }

                    vueinst.newsTitle = result.title;
                    vueinst.newsMessage = result.post_message;
                }
            };

            req.open('POST', "/club_managers/viewNewsDetails", true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify({
                post_id: postID
            }));
        },

        update_news: function(){
            let isPrivate;
            if (vueinst.newsPrivacy === 'private') {
                isPrivate = '1';
            } else {
                isPrivate = '0';
            }

            let req = new XMLHttpRequest();

            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.newsTitle = '';
                    vueinst.newsMessage = '';
                    vueinst.newsPrivacy = '';
                    alert('Announcement details changed sucessfully');
                    window.location.href = "club-manager-profile.html";
                } else if (this.readyState == 4 && this.status == 401) {
                    alert('Cannot change announcement details');
                }
            };

            req.open('POST', '/club_managers/updateNews', true);
            req.setRequestHeader("Content-type", "application/json");

            req.send(JSON.stringify({
                title: vueinst.newsTitle,
                post_message: vueinst.newsMessage,
                private_message: isPrivate,
                post_id: postID
            }));
        },

        logout: function() {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    alert('Logged out sucessfully');
                    vueinst.signedIn = false;
                    window.location.href = "index.html";
                } else if (this.readyState == 4 && this.status == 403) {
                    alert('Logout FAILED');
                }
            };

            req.open('POST', '/logout', true);
            req.send();
        },

        getClubID() {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    let response = JSON.parse(this.responseText);

                    vueinst.club_id = response.clubID;
                    vueinst.club_name = response.clubName;
                    vueinst.club_email = response.clubEmail;
                    vueinst.club_description = response.clubDescription;
                    vueinst.club_phone = response.clubPhone;

                    vueinst.new_club_name = response.clubName;
                    vueinst.new_club_email = response.clubEmail;
                    vueinst.new_club_description = response.clubDescription;
                    vueinst.new_club_phone = response.clubPhone;
                }
            };

            req.open('GET', '/club_managers/getClubID', true);
            req.send();
        },

        update_club: function(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.new_club_name = '';
                    vueinst.new_club_email = '';
                    vueinst.new_club_description = '';
                    vueinst.new_club_phone = '';
                    alert('Club details changed sucessfully');
                    window.location.href = "club-manager-profile.html";
                } else if (this.readyState == 4 && this.status == 401) {
                    alert('Cannot change club details');
                }
            };

            req.open('POST', '/club_managers/editClub', true);
            req.setRequestHeader("Content-type", "application/json");

            req.send(JSON.stringify({
                club_name: vueinst.new_club_name,
                club_email: vueinst.new_club_email,
                club_description: vueinst.new_club_description,
                club_phone: vueinst.new_club_phone,
                club_id: vueinst.club_id
            }));
        }
    }

}).mount('#coolfroggyclub');


window.onload = function () {
    /*
        This checks if user has logged in to
        display the "sign out" and "account" OR "log in/ signup"
    */

    vueinst.view_old_info();
    vueinst.view_old_news();
    vueinst.getClubID();

    if (window.location.href === "http://localhost:8080/member-profile.html"){
        vueinst.view_member_news();
        vueinst.view_joined_clubs();
        vueinst.view_joined_event();
        vueinst.view_clubs_upcoming_events();
    }

    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200 ) {
            vueinst.signedIn = true;
        } else if (req.readyState === 4 && req.status === 401) {
            vueinst.signedIn = false;
        }
    };

    req.open('GET', '/checkLogin', true);
    req.send();
};