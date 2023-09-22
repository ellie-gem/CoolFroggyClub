const vueinst1 = Vue.createApp({
    data() {
        return {
            signedIn: false,
            buttonHover: false,

            // check if club_member or club_manager
            access_type: '',

            all_events: [],
            show_events: [],
            all_clubs: [],
            all_news: [],
            show_news: [],
            search_target: '',

            // to toggle menu bar
            menu: 'hamburger',
            dropdown: 'dropdown-menu',

            // Details for adding events
            club_id: '',
            event_name: '',
            club_name: '',
            event_date: '',
            event_location: '',
            event_message: '',

            // Details for adding news
            news_title: '',
            post_date: '',
            privacy: '',
            post_message: ''
        };
    },

    mounted() {
        // show events even when user has not logged in
        if (window.location.href === "http://localhost:8080/upcoming-events.html" || window.location.href === "http://localhost:8080/index.html" || window.location.href === "http://localhost:8080/"){
            this.view_event('all');
        }
        // show clubs even when user has not logged in
        if (window.location.href === "http://localhost:8080/join-a-club.html"){
            this.view_club();
        }
        // show public clubs' news even when user has not logged in
        if (window.location.href === "http://localhost:8080/latest-news.html" || window.location.href === "http://localhost:8080/index.html" || window.location.href === "http://localhost:8080/"){
            this.view_news('all');
        }

        // Gets club ID
        if (window.location.href === "http://localhost:8080/add-events.html" || window.location.href === "http://localhost:8080/add-news.html") {
            this.getClubID();
        }

        this.$nextTick(() => {
            // This checks if user has logged in to display the
            // "sign out" and "account" OR "log in/ signup"
            let req = new XMLHttpRequest();

            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    vueinst1.signedIn = true;
                    // console.log(req.responseText);
                    vueinst1.access_type = req.responseText;
                } else {
                    vueinst1.signedIn = false;
                }
            };

            req.open('GET', '/checkLogin', true);
            req.send();
        });
    },

    computed: {
        URL: function () {
            // If user is signed in, change log in button to account button
            if (this.signedIn === false) {
                return "login-new.html";
            } else {
                if (vueinst1.access_type === "Club Member" || vueinst1.access_type === "Club Manager"){
                    return 'member-profile.html';
                }else if (vueinst1.access_type === "Admin"){
                    return 'admin-profile.html';
                }
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
            } else if (this.access_type === 'Club Member' || this.access_type === 'Admin') {
                return 'account-dropdown-item not-manager';
            }
        }
    },

    methods: {
        // upcoming-events.html functions
        view_event: function(event_type) {
            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    vueinst1.all_events = JSON.parse(this.response);
                    vueinst1.show_events = Array(vueinst1.all_events.length).fill(false);
                }
            };

            xhttp.open("GET", "/view-events?type=" + encodeURIComponent(event_type), true);
            xhttp.send();
        },

        show_full_event: function(index){
            if (vueinst1.show_events[index] === false){
                vueinst1.show_events[index] = true;
            }
        },

        hide_full_event: function(index){
            if (vueinst1.show_events[index] === true){
                vueinst1.show_events[index] = false;
            }
        },

        join_event: function(id){

            let join_info = {event_id: id};

            let req = new XMLHttpRequest();

            req.onreadystatechange = function(){
                if (req.readyState === 4 && req.status === 200){
                    alert("Join Event sucessfully");
                }else if(req.readyState === 4 && req.status === 403){
                    alert("Event already joined, cannot do it again");
                }else if(req.readyState === 4 && req.status === 401){
                    alert("Please log in to join the event");
                    window.location.href = "login-new.html";
                }
            };

            req.open('POST', '/users/join-event', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(join_info));
        },

        formatDate: function(date) {
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric"
            };

            return new Date(date).toLocaleDateString(undefined, options);
        },


        // join-a-club.html functions
        view_club: function(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    vueinst1.all_clubs = JSON.parse(req.response);
                }
            };

            req.open("GET", "/view-clubs", true);
            req.send();
        },

        join_club: function(id){

            let join_info = { club_id : id };

            let req = new XMLHttpRequest();

            req.onreadystatechange = function(){
                if (req.readyState === 4 && req.status === 200){
                    alert("Join club sucessfully");
                }else if(req.readyState === 4 && req.status === 403){
                    alert("Club already joined, cannot do it again");
                }else if(req.readyState === 4 && req.status === 401){
                    alert("Please log in to join the club");
                    window.location.href = "login-new.html";
                }
            };

            req.open('POST', '/users/join-club', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(join_info));
        },

        // latest-news.html functions
        view_news: function(freshness){

            let news_freshness = {type: freshness};

            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    vueinst1.all_news = JSON.parse(req.response);
                    vueinst1.show_news = Array(vueinst1.all_news.length).fill(false);
                }
            };

            req.open("POST", "/view-news", true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(news_freshness));
        },

        show_full_message: function(index){
            if (vueinst1.show_news[index] === false){
                vueinst1.show_news[index] = true;
            }
        },

        hide_full_message: function(index){
            if (vueinst1.show_news[index] === true){
                vueinst1.show_news[index] = false;
            }
        },

        search_news: function(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if ( req.readyState === 4  && req.status === 200) {
                    vueinst1.all_news = JSON.parse(req.response);
                    vueinst1.show_news = Array(vueinst1.all_news.length).fill(false);
                }
            };

            req.open('GET', "/search-news?target=" + encodeURIComponent(vueinst1.search_target), true);
            req.send();
        },


        logout: function() {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    alert('Logged out Sucessfully');
                    vueinst1.signedIn = false;
                    window.location.href = "index.html";
                } else if (this.readyState == 4 && this.status == 403) {
                    alert('You have not logged in yet');
                }
            };

            req.open('POST', '/logout', true);
            req.send();
        },

        // to toggle menu in nav bar
        toggleMenu: function() {
            if (this.menu === 'hamburger') {
                this.menu = 'hamburger is-active';
                this.dropdown = 'dropdown-menu open';
            } else {
                this.menu = 'hamburger';
                this.dropdown = 'dropdown-menu';
            }
        },

        getClubID() {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    let response = JSON.parse(this.responseText);

                    vueinst1.club_id = response.clubID;
                    vueinst1.club_name = response.clubName;
                }
            };

            req.open('GET', '/club_managers/getClubID', true);
            req.send();
        },

        addEvent() {
            let private;
            if (vueinst1.privacy === 'private') {
                private = 1;
            } else if (vueinst1.privacy === 'public') {
                private = 0;
            }

            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    alert('Added new event successfully!');
                    window.location.href = "club-manager-profile.html";
                } else if (this.readyState === 4 && this.status === 403) {
                    alert('Event name already exists, or event location already booked at this time');
                }
            };

            req.open('POST', '/club_managers/addEvent', true);
            req.setRequestHeader("Content-type", "application/json");

            req.send(JSON.stringify({
                event_name: vueinst1.event_name,
                event_message: vueinst1.event_message,
                event_date: vueinst1.event_date,
                event_location: vueinst1.event_location,
                club_id: vueinst1.club_id,
                private_event: private,
            }));
        },

        addNews() {
            let private;
            if (vueinst1.privacy === 'private') {
                private = 1;
            } else if (vueinst1.privacy === 'public') {
                private = 0;
            }

            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    alert('Added new announcement successfully!');
                    window.location.href = "club-manager-profile.html";
                } else if (this.readyState === 4 && this.status === 403) {
                    alert('Announcement title already exists');
                }
            };

            req.open('POST', '/club_managers/newAnnouncement', true);
            req.setRequestHeader("Content-type", "application/json");

            req.send(JSON.stringify({
                title: vueinst1.news_title,
                post_message: vueinst1.post_message,
                private_message: private,
                club_id: vueinst1.club_id
            }));
        }

    }
}).mount('#coolfroggyclub');

