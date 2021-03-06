import keymirror from 'keymirror';

export default keymirror({
    // Authentication
    AUTHENTICATION_SET_EMAIL: "set_email",
    AUTHENTICATION_SET_USERNAME:"set_username",
    AUTHENTICATION_SET_PASSWORD: "set_password",
    AUTHENTICATION_SET_ADDRESS: "set_address",
    AUTHENTICATION_REGISTER_USER: "register_user",
    AUTHENTICATION_REGISTER_USER_SUCCESS: "register_user_success",
    AUTHENTICATION_REGISTER_USER_FAIL: "register_user_fail",
    AUTHENTICATION_ADD_USER_SUCCESS: 'add_user_success',
    AUTHENTICATION_LOGIN_USER: 'login_user',
    AUTHENTICATION_LOGIN_USER_SUCCESS: 'login_user_success',

    // Navigation
    CURRENT_SCENE: "current_scene",

    // Profile 
    PROFILE_SET_PROFILE: "set_profile",
    PROFILE_UPDATE_USER_PROFILE: "update_user_profile",
    PROFILE_UPDATE_USER_PROFILE_SUCCESS: "update_user_profile_success",
    PROFILE_UPDATE_USER_PROFILE_FAIL: "update_user_profile_fail",
    PROFILE_FETCH_USER_PROFILE: "fetch_user_profile",
    PROFILE_FETCH_USER_PROFILE_SUCCESS: "fetch_user_profile_success",
});