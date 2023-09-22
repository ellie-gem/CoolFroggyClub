const vueinst = Vue.createApp({
    data() {
        return {
            signedIn: false,
            buttonHover: false,

            // check if club_member or club_manager
            access_type: '',

            // details needed for editing user details
            first_name: '',
            last_name: '',
            dob: null,
            password: '',
            confirm_password: '',
            mobile: '',
            email: '',

            // details for original user details (details needed for editing user details)
            originFirstName: '',
            originLastName: '',
            originDOB: '',
            originMobile: '',
            originEmail: '',

            // personalized news/announcement/events (coming from clubs managed)
            club_news: [],
            show_news: [],
            club_events: [],
            show_events: [],
            event_participants: [],
            show_participants: [],

            // details for club manager profile
            club_id: '',
            club_name: '',
            club_email: '',
            club_members: [],
            club_description: '',

            // to toggle menu bar
            menu: 'hamburger',
            dropdown: 'dropdown-menu'
        };
    },

    // mounted() {

    // }

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
        },
        URL_manager: function() {
            if (this.access_type === 'Club Manager') {
                return "club-manager-profile.html";
            }
        },
        show_your_club: function () {
            if (this.access_type === 'Club Manager') {
                return 'account-dropdown-item';
            } else if (this.access_type === 'Club Member') {
                return 'account-dropdown-item not-manager';
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

        // functions to edit user details
        view_old_info: function(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if ( req.readyState === 4  && req.status === 200) {
                    let result = JSON.parse(req.response)[0];

                    vueinst.first_name = result.first_name;
                    vueinst.last_name = result.last_name;
                }
            };

            req.open('GET', "/users/info", true);
            req.send();
        },

        // functions to help get personalized news from club
        get_club_news: function(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    vueinst.club_news = JSON.parse(req.response);
                    vueinst.show_news = Array(vueinst.club_news.length).fill(false);
                }
            };

            req.open('POST', '/club_managers/viewNews', true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.send(JSON.stringify({
                club_id: vueinst.club_id
            }));
        },

        show_full_message: function(index){
            if (vueinst.show_news[index] === false){
                vueinst.show_news[index] = true;
            }
        },

        hide_full_message: function(index){
            if (vueinst.show_news[index] === true){
                vueinst.show_news[index] = false;
            }
        },

        show_full_event: function(index){
            if (vueinst.show_events[index] === false){
                vueinst.show_events[index] = true;
            }
        },

        hide_full_event: function(index){
            if (vueinst.show_events[index] === true){
                vueinst.show_events[index] = false;
            }
        },

        get_club_event(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    vueinst.club_events = JSON.parse(this.response);
                    vueinst.show_events = Array(vueinst.club_events.length).fill(false);
                    vueinst.show_participants = Array(vueinst.club_events.length).fill(false);
                }
            };

            req.open('POST', '/club_managers/viewEvents', true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.send(JSON.stringify({
                club_id: vueinst.club_id
            }));
        },

        logout: function() {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    alert('Logged out');
                    vueinst.signedIn = false;
                    window.location.href = "index.html";
                } else if (this.readyState == 4 && this.status == 403) {
                    alert('Not logged out');
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

                    // Once club_id is received, call viewMembers and get_club_event
                    vueinst.viewMembers();
                    vueinst.get_club_event();
                    vueinst.get_club_news();
                }
            };

            req.open('GET', '/club_managers/getClubID', true);
            req.send();
        },

        viewMembers() {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    vueinst.club_members = JSON.parse(this.response);
                }
            };

            req.open('POST', '/club_managers/viewMembers', true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.send(JSON.stringify({
                club_id: vueinst.club_id
            }));
        },

        deleteMember: function(userID) {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    vueinst.viewMembers();
                }
            };

            req.open('DELETE', '/club_managers/deleteMembers', true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.send(JSON.stringify({
                user_id: userID
            }));
        },

        viewRSVPS(eventID) {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    let event_rsvps = JSON.parse(this.response);
                    vueinst.event_participants = event_rsvps;
                }
            };

            req.open('POST', '/club_managers/viewEventgoers', true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.send(JSON.stringify({
                event_id: eventID
            }));
        },

        show_event_participants: function(index, eventID){
            vueinst.viewRSVPS(eventID);

            for (let i = 0; i < vueinst.show_participants.length; i++) {
                vueinst.hide_event_participants(i);
            }

            if (vueinst.show_participants[index] === false){
                vueinst.show_participants[index] = true;
            }
        },

        hide_event_participants: function(index){
            if (vueinst.show_participants[index] === true){
                vueinst.show_participants[index] = false;
            }
        },

        // to toggle menu in nav bar ()
        toggleMenu: function() {
            if (this.menu === 'hamburger') {
                this.menu = 'hamburger is-active';
                this.dropdown = 'dropdown-menu open';
            } else {
                this.menu = 'hamburger';
                this.dropdown = 'dropdown-menu';
            }
        },

        addEvent: function() {
            window.location.href = "add-events.html";
        },

        addNews: function() {
            window.location.href = "add-news.html";
        },

        editEvent: function(event_id) {
            window.location.href = "edit-events.html?event_id=" + event_id;
        },

        editNews: function(post_id) {
            window.location.href = "edit-news.html?post_id=" + post_id;
        },

        editClub: function() {
            window.location.href = "club-account.html";
        }
    }
}).mount('#coolfroggyclub');

window.onload = function () {
    // Gets club ID
    if (window.location.href === "http://localhost:8080/club-manager-profile.html") {
        vueinst.getClubID();
    }

    vueinst.view_old_info();

    if (window.location.href === "http://localhost:8080/member-profile.html"){
        vueinst.view_member_news();
        vueinst.count_member_news();
    }

    // This checks if user has logged in to display the
    // "sign out" and "account" OR "log in/ signup"
    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            vueinst.signedIn = true;
            vueinst.access_type = req.responseText;
        } else if (req.readyState === 4 && req.status === 401) {
            vueinst.signedIn = false;
        }
    };

    req.open('GET', '/checkLogin', true);
    req.send();
};