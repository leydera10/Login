import express from "express";
import UserManager from "../controllers/UserManager.js"
import { Router } from "express";

const userRouter = Router()
const user = new UserManager()

userRouter.get("/register", (req, res) => {
    try {
      res.redirect("/register");
    } catch (error) {
      res.status(500).send("Error al acceder al perfil: " + error.message);
    }
  });

  userRouter.post("/register", (req, res) => {
    try {
      let newUser = req.body;
      user.addUser(newUser);
      res.redirect("/login");
    } catch (error) {
      res.status(500).send("Error al acceder al perfil: " + error.message);
    }
  });
  
  

  userRouter.post("/login", async (req, res) => {
    try {
         let email = req.body.email
         const data = await user.validateUser(email)
         if (data && data.password === req.body.password) {
            req.session.emailUsuario = email
            req.session.nomUsuario = data.first_name;
            req.session.apeUsuario = data.last_name;
            req.session.rolUsuario = data.rol;
            
            if (data.rol === 'admin') {
                res.redirect("/profile");
            } else {
                res.redirect("/products");
            }
        } else {
            res.redirect("../../login");
        }
    } catch (error) {
        res.status(500).send("Error al acceder al perfil " + error.message);
    }
});


userRouter.get("/logout", async (req, res)=> {
    req.session.destroy((error) => {
        if(error)
        {
            return res.json({ status: 'logout Error', body: error})
        }
        res.redirect('../../login')
    })
})



export default userRouter