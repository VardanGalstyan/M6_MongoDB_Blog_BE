import GoogleStrategy from 'passport-google-oauth20'

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}:${process.env.PORT}/authors/googleRedirect`
}, (accessToken, refreshToken, profile, passportNext) => {
    try {

    } catch (error) {
        console.log(error);
    }
})

export default googleStrategy