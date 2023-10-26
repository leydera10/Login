import passport from 'passport'
import local from 'passport-local'
import {createHash , isValidPassword } from '../utils.js'
import GitHubStrategy from "passport-github2"
import UserManager from '../controllers/UserManager.js'

const LocalStrategy = local.Strategy
const userMan = new UserManager()

const initializePassword = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: "email"},
        async (req, username, password, done ) => {
            const { first_name, last_name, email, age, rol } = req.body;

            try {
                let user = await userMan.findEmail({ email: username})
                if (user) {
                    console.log("el usuario ya existe");
                    return done(null, false);
                }

                const hasheadPassword = await createHash(password);
                
                const newUser = {
                   first_name,
                   last_name,
                   email, 
                   age,
                   password: hasheadPassword,
                   rol
                };
                let result = await userMan.addUser(newUser);
                return done(null, result)
                } catch (error) {
                    return done("Error getting user  " + error );
                }
    }))
        passport.serializeUser((user, done)=> {
            done(null,user._id)
        })
        passport.deserializeUser(async (id, done )=>{
            let user = await userMan.getUserById(id)
            done(null, user)
        })
        passport.use('login', new LocalStrategy({usernameField: "email"}, async(username, password, done)=>{
            try {
                const user = await userMan.findEmail({email:username})
                if (!user)
                {
                    console.log('the user does bot exist')
                    return done (null, user )
                }
                if (!isValidPassword(user,password)) return done ( null, false )
                return done (null, user )
                
            } catch (error) {
                return done (error)
                
            }
        }))
        passport.use('github', new GitHubStrategy({
            clientID:"Iv1.cfbadf4e5f70394f",
            clientSecret: "5df93d67a137df7d60a1e1f5a753b078f3cfbe75",
            callbackURL: "http://localhost:4000/api/sessions/githubcallback"
        },async (accessToken, refreshToken, profile, done)=>{
            try {
                console.log(profile)
                let user = await userMan.findEmail({email:profile._json.email})
                if(!user ){
                    let newUser ={
                        first_name: profile._json.login,
                        last_name:"github",
                        age:77,
                        email:profile._json.email,
                        password:"",
                        rol:"usuario"
                    }
                    let result = await  userMan.addUser(newUser)
                    done(null, result)
                }
                else{
                    done(null, user)
                }
            } catch (error) {
                return done(error)
            }
        }
        ))
}

export default initializePassword;