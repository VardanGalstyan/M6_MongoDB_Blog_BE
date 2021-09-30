import GoogleStrategy from 'passport-google-oauth20'
import AuthorsModel from '../services/Authors/schema.js'
import { generateJWToken } from './tools.js'
import passport from 'passport'


const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}:${process.env.PORT}/authors/googleRedirect`
}, async (accessToken, refreshToken, profile, passportNext) => {
    try {
        const author = await AuthorsModel.findOne({ googleId: profile.id })
        if (author) {
            const tokens = await generateJWToken(author)
            passportNext(null, { tokens })
        } else {
            const newAuthor = {
                name: profile.name.givenName,
                username: profile.name.familyName,
                role: "Author",
                googleId: profile.id
            }
            const createdAuthor = new AuthorsModel(newAuthor)
            const savedAuthor = await createdAuthor.save()
            const tokens = await generateJWToken(savedAuthor)
            passportNext({ author: savedAuthor, tokens })

        }

    } catch (error) {
        console.log(error);
        passportNext(error)
    }
})

passport.serializeUser(function (author, passportNext) {
    passportNext(null, author)
})


export default googleStrategy