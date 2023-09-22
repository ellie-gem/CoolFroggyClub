const vueinst = Vue.createApp({
    data() {
        return {
            signedIn: false,
            buttonHover: false,

            // check if club_member or club_manager
            access_type: '',

            // details for login
            userEmail: '',
            userPassword: '',
            userType: '',

            // details for sign up
            first_name: '',
            last_name: '',
            dob: null,
            password: '',
            confirm_password: '',
            mobile: '',
            email: '',

            //details for club manager sign up
            club_name: '',
            club_email: '',
            club_description:'',

            // details for original user details
            originFirstName: '',
            originLastName: '',
            originDOB: '',
            originMobile: '',
            originEmail: '',

            // to toggle menu bar
            menu: 'hamburger',
            dropdown: 'dropdown-menu',

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
            space_validity: 'invalid',

            // toggle google sign in div
            signin_google: false,
            option_text: "Sign in with Google",
            login_option: "google"
        };
    },

    mounted() {
        // This checks if user has logged in to display the "sign out" and "account" OR "log in/ signup"
        this.$nextTick(() => {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    vueinst.access_type = req.responseText;
                    //console.log("signed already");
                    vueinst.signedIn = true;
                } else {
                    vueinst.signedIn = false;
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
                if (this.access_type === "Club Member" || this.access_type === "Club Manager") {
                    return 'member-profile.html';
                }else if (this.access_type === "Admin"){
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
        login() {
            let req = new XMLHttpRequest();

            let login_data = {
                email: vueinst.userEmail,
                password: vueinst.userPassword,
                type: vueinst.userType
            };

            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    vueinst.userEmail = '';
                    vueinst.userPassword = '';
                    vueinst.access_type = vueinst.userType;
                    vueinst.userType = '';

                    if (window.location.href === "http://localhost:8080/login-new.html"){
                        if (vueinst.access_type === 'Club Member' || vueinst.access_type === 'Club Manager'){
                            window.location.href = "member-profile.html";
                        } else if (vueinst.access_type === 'Admin'){
                            window.location.href = "admin-profile.html";
                        }else{
                            window.location.href = "index.html";
                        }
                    }
                }
            };
            req.open('POST', '/login', true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(login_data));
        },

        signup() {
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
                    window.location.href = "login-new.html";
                }
            };

            req.open('POST', '/signup', true);
            req.setRequestHeader('Content-type', 'application/json');
            req.send(JSON.stringify(signup_data));
        },

        signup_clubmanager(){
            let req = new XMLHttpRequest();

            let signup_clubmanager_data = {
                club_name: vueinst.club_name,
                club_email: vueinst.club_email,
                club_description: vueinst.club_description
            };

            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    alert("Request to form a club submitted. Please wait for Admin approval.");
                    window.location.href = "member-profile.html";
                }
            };

            req.open('POST', '/users/add-club-request', true);
            req.setRequestHeader('Content-type', 'application/json');
            req.send(JSON.stringify(signup_clubmanager_data));
        },

        logout() {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    alert('Logged out');
                    vueinst.signedIn = false;
                    window.location.href = "index.html";
                } else if (this.readyState === 4 && this.status === 403) {
                    alert('Not logged out');
                }
            };

            req.open('POST', '/logout', true);
            req.send();
        },

        // to show google sign in
        toggleGoogle() {
            if (this.signin_google === false) {
                this.signin_google = true;
                this.option_text = "Back to Cool Froggy Login";
                this.login_option = "froggy";
            } else {
                this.signin_google = false;
                this.option_text = "Sign in with Google";
                this.login_option = "google";
            }
        },

        // to toggle menu in nav bar
        toggleMenu() {
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
}).mount('#signin');



// THIS HAS TO BE PUT OUTSIDE OF VUEINST TO WORK
function google_login(response) {
    let req = new XMLHttpRequest();

    let google_login_data = {
        google_login_info: response,
        type: vueinst.userType
    };

    //console.log(response);

    req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            vueinst.access_type = vueinst.userType;
            alert('Logged in with Google Sucessfully');

            if (vueinst.access_type === 'Club Member' || vueinst.access_type === 'Club Manager'){
                window.location.href = "member-profile.html";
            } else if (vueinst.access_type === 'Admin'){
                window.location.href = "admin-profile.html";
            }else{
                window.location.href = "index.html";
            }

        } else if (this.readyState === 4 && this.status === 401) {
            alert('Login FAILED');
        }
    };

    req.open('POST', '/google-login');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(google_login_data));
}