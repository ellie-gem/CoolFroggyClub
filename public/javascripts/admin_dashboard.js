const vueinst = Vue.createApp({
    data() {
        return {
            signedIn: false,
            buttonHover: false,

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

            // this is to show all the existing clubs
            all_clubs: [],

            // this is to show all existing normal users (admin excluded)
            all_users: [],

            // this is to show all the pending clubs
            pending_clubs: [],

            // to toggle menu bar
            menu: 'hamburger',
            dropdown: 'dropdown-menu',

            // change password
            change_password: false,
            pw_required: false,

            // reveal passwords
            is_visible: false,
            reveal: 'password',
            icon: 'no-see',

            // check passwords
            message: 'message-hide',
            match_validity: 'invalid',
            letter_validity: 'invalid',
            capital_validity: 'invalid',
            number_validity: 'invalid',
            length_validity: 'invalid',
            special_validity: 'invalid',
            space_validity: 'invalid'
        };
    },

    computed: {
        URL: function () {
            // If user is signed in, change log in button to account button
            if (this.signedIn === false) {
                return "login-new.html";
            } else {
                return 'admin-account.html';
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

        // functions to edit admin's personal details
        view_old_info: function(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if ( req.readyState === 4  && req.status === 200) {
                    let result = JSON.parse(req.response)[0];

                    if (window.location.href === "http://localhost:8080/admin-account.html"){
                        vueinst.originFirstName = result.first_name;
                        vueinst.originLastName = result.last_name;
                        vueinst.originDOB = result.date_of_birth;
                        vueinst.originEmail = result.email;
                        vueinst.originMobile = result.mobile;

                        vueinst.first_name = result.first_name;
                        vueinst.last_name = result.last_name;
                        vueinst.dob = result.date_of_birth;
                        vueinst.mobile = result.mobile;
                        vueinst.email = result.email;
                    }else if (window.location.href === "http://localhost:8080/admin-profile.html"){
                        vueinst.first_name = result.first_name;
                        vueinst.last_name = result.last_name;
                        vueinst.dob = result.date_of_birth;
                        vueinst.mobile = result.mobile;
                        vueinst.email = result.email;
                    }

                }
            };

            req.open('GET', "/admins/info", true);
            req.send();
        },

        update_info: function(){
            let new_info = {
                new_fname: this.first_name,
                new_lname: this.last_name,
                new_email: this.email,
                new_mobile: this.mobile,
                new_password: this.password
            };

            const cnfm_pw = document.getElementById("confirm-password");

            // if user chooses to change password
            if (this.change_password) {
                // validate password
                if (this.password !== this.confirm_password) {
                    cnfm_pw.setCustomValidity('Passwords do not match');
                    // https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
                    // alert('Passwords do not match');
                    return;
                }

                if (this.letter_validity !== 'valid' || this.capital_validity !== 'valid'
                || this.number_validity !== 'valid' || this.length_validity !== 'valid'
                || this.special_validity !== 'valid' || this.space_validity !== 'valid') {
                    cnfm_pw.setCustomValidity('Ensure password fulfills criteria');
                    // alert('Ensure password fulfills criteria');
                    return;
                }
            }

            let req = new XMLHttpRequest();

            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.first_name = '';
                    vueinst.last_name = '';
                    vueinst.dob = null;
                    vueinst.password = '';
                    vueinst.confirm_password = '';
                    vueinst.mobile = '';
                    vueinst.email = '';
                    alert('Account details changed sucessfully');
                    window.location.href = "admin-profile.html";
                } else if (this.readyState == 4 && this.status == 401) {
                    alert('Cannot change account details');
                }
            };

            req.open('POST', '/admins/update-info', true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(new_info));
        },

        // logout option
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

        // functions to manage clubs
        view_all_clubs: function() {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (req.readyState === 4 && req.status === 200) {
                    vueinst.all_clubs = JSON.parse(req.response);
                }
            };

            req.open('GET', '/admins/viewClubs', true);
            req.send();
        },

        delete_club: function(clubID){
            let club_info = { club_id: clubID };

            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (req.readyState === 4 && req.status === 200) {
                    vueinst.view_all_clubs();
                }
            };

            req.open('DELETE', '/admins/deleteClubs', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(club_info));
        },

        view_pending_clubs: function(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (req.readyState === 4 && req.status === 200) {
                    vueinst.pending_clubs = JSON.parse(req.response);
                }
            };

            req.open('GET', '/admins/viewPendingClubs', true);
            req.send();
        },

        approve_club: function(index){
            // add to official club list and delete club from pending list
            let club_data = vueinst.pending_clubs[index];

            let req = new XMLHttpRequest();

            req.onreadystatechange = function(){
                if (req.readyState === 4 && req.status === 200){
                    vueinst.view_pending_clubs();
                }
            };

            req.open('POST', '/admins/addClub', true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(club_data));
        },

        reject_club: function(index){
            let club_data = vueinst.pending_clubs[index];

            let req = new XMLHttpRequest();

            req.onreadystatechange = function(){
                if (req.readyState === 4 && req.status === 200){
                    alert("Rejected Club: ", club_data.club_name);
                    vueinst.view_pending_clubs();
                }
            };

            req.open('POST', '/admins/rejectClub', true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(club_data));
        },

        // functions to manage users (except admins)
        view_all_users: function(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (req.readyState === 4 && req.status === 200) {
                    vueinst.all_users = JSON.parse(req.response);
                }
            };

            req.open('GET', '/admins/viewUsers', true);
            req.send();
        },

        delete_user: function(userID) {
            let user_info = { user_id: userID };

            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    vueinst.view_all_users();
                }
            };

            req.open('DELETE', '/admins/deleteUsers', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(user_info));
        },

        // sign up other admins
        signup_admin: function(){
            const cnfm_pw = document.getElementById("confirm-password");

            // validate password
            if (this.password !== this.confirm_password) {
                cnfm_pw.setCustomValidity('Passwords do not match');
                // https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
                // alert('Passwords do not match');
                return;
            }

            if (this.letter_validity !== 'valid' || this.capital_validity !== 'valid'
            || this.number_validity !== 'valid' || this.length_validity !== 'valid'
            || this.special_validity !== 'valid' || this.space_validity !== 'valid') {
                cnfm_pw.setCustomValidity('Ensure password fulfills criteria');
                // alert('Ensure password fulfills criteria');
                return;
            }

            let req = new XMLHttpRequest();

            let signup_data = {
                first_name: vueinst.first_name,
                last_name: vueinst.last_name,
                dob: vueinst.dob,
                password: vueinst.password,
                mobile: vueinst.mobile,
                email: vueinst.email
            };

            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    vueinst.first_name = '';
                    vueinst.last_name = '';
                    vueinst.dob = null;
                    vueinst.password = '';
                    vueinst.confirm_password = '';
                    vueinst.mobile = '';
                    vueinst.email = '';
                    alert("New Admin added to page");
                }else if (req.readyState === 4 && req.status === 403){
                    alert("Admin with given name and email already exist");
                }
            };

            req.open('POST', '/admins/registerAdmins', true);
            req.setRequestHeader('Content-type', 'application/json');
            req.send(JSON.stringify(signup_data));
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

        // reveal / unreveal passwords
        see: function() {
            if (this.is_visible) {
                this.reveal = 'password';
                this.is_visible = false;
                this.icon = 'no-see';
            } else {
                this.reveal = 'text';
                this.is_visible = true;
                this.icon = 'see';
            }
        },

        // When the user clicks on the password field, show the message box
        reveal_message: function() {
            this.message = 'message-show';
        },

        // check password match
        validatePassword: function() {
            // Validate lowercase letters
            let lowerCaseLetters = /[a-z]/g;
            if (this.password.match(lowerCaseLetters)) {
                this.letter_validity = 'valid';
            } else {
                this.letter_validity = 'invalid';
            }

            // Validate capital letters
            let upperCaseLetters = /[A-Z]/g;
            if (this.password.match(upperCaseLetters)) {
                this.capital_validity = 'valid';
            } else {
                this.capital_validity = 'invalid';
            }

            // Validate numbers
            let numbers = /[0-9]/g;
            if (this.password.match(numbers)) {
                this.number_validity = 'valid';
            } else {
                this.number_validity = 'invalid';
            }

            // Validate length
            if (this.password.trim().length >= 8) {
                this.length_validity = 'valid';
            } else {
                this.length_validity = 'invalid';
            }

            // Validate special characters
            let specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
            if (this.password.match(specialChars)) {
                this.special_validity = 'valid';
            } else {
                this.special_validity = 'invalid';
            }

            // Validate no space
            if (this.password.match(' ')) {
                this.space_validity = 'invalid';
            } else {
                this.space_validity = 'valid';
            }

            // validate both passwords match
            if (this.password === this.confirm_password) {
                this.match_validity = 'valid';
            } else {
                this.match_validity = 'invalid';
            }
        }

    }
}).mount('#coolfroggyclub');

window.onload = function () {

    vueinst.view_old_info();
    if (window.location.href === "http://localhost:8080/admin-profile.html") {
        vueinst.view_all_clubs();
        vueinst.view_all_users();
    }else if (window.location.href === "http://localhost:8080/pending-club-manager.html"){
        vueinst.view_pending_clubs();
    }
    /*
        This checks if user has logged in to
        display the "sign out" and "account" OR "log in/ signup"
    */
    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            vueinst.signedIn = true;
        } else if (req.readyState === 4 && req.status === 401) {
            vueinst.signedIn = false;
        }
    };

    req.open('GET', '/admins/checkLogin', true);
    req.send();
};
