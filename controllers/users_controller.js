const fs = require('fs');
const path = require('path');
const User = require("../models/user");

/*
Route            /users/profile
Description      Get profile details of employee
Access           PUBLIC
Parameter        UserId
Methods          GET
*/
// render the profile page
module.exports.profile = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (user) {
      return res.render("profile", {
        title: "Placement Cell || profile",
        profile_user: user,
      });
    }
  } catch (err) {
    console.log("Error", err);
    return;
  }
};


/*
Route            /users/update
Description      Update employee profile details 
Access           PUBLIC
Parameter        UserId
Methods          POST
*/

module.exports.update = async (req, res) => {

  try {

    if (req.user.id == req.params.id) {
      
      let user = await User.findById(req.params.id);

      // calling the user static method to upload th profile picture
      User.uploadedAvatar(req, res, async (err) => {
        if(err){
          console.log('Multer Error: ', err);
          return res.redirect('back');
        }
        
        // Set Name and Email
        user.name = req.body.name;
        user.email = req.body.email;

        if(req.file){

          if(user.avatar){
            // If User Avatar already exists in the "/uploads/users/avatars" Directory
            if(
              fs.existsSync(
								path.join(__dirname, "..", user.avatar)
							)
            ){
            //Delete that Old Avatar
            fs.unlinkSync(path.join(__dirname, '..', user.avatar));

            }
          }

            //Save the New Avatar
            // this is saving the path of the uploaded file into the avatar field in the user
            user.avatar = User.avatarPath + '/' + req.file.filename;
        }

        await user.save();

        req.flash('success','Profile Updated Successfully!');

        return res.redirect('back');
      });
      
    } else {

      req.flash('error','UnAuthorized!');
      return res.status(401).send("Unauthorized");

    }

  
  } catch (err) {

    req.flash('error', err);
    console.log("Error", err);
    return;
    
  }
};


/*
Route            /sign-in
Description      Renders the Sign In Page
Access           PUBLIC
Parameter        None
Methods          GET
*/

// render the sign up page
module.exports.signIn = async (req, res) => {


  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  return res.render("user_sign_in", {
    title: "Placement Cell | Sign In",
  });
};


/*
Route            /sign-up
Description      Renders the Sign Up Page
Access           PUBLIC
Parameter        None
Methods          GET
*/
// render the sign up page
module.exports.signUp = async (req, res) => {
  if (req.isAuthenticated()) {

    return res.redirect('/');

  }

  return res.render("user_sign_up", {
    title: "Placement Cell | Sign Up",
  });
};


/*
Route            /create
Description      performs the Registration of Employee
Access           PUBLIC
Parameter        None
Methods          POST
*/
// get the sign up data
module.exports.create = async (req, res) => {
  try {

    // console.log(req.body);
    // check if the password and confirm password are same or not
    if (req.body.password != req.body.confirm_password) {
      req.flash('error', "Password doesn't match!");
      return res.redirect("back");
    }

    try {
      // check if the email address already exists in database or not if does'nt exists then create the user
      let user = await User.findOne({ email: req.body.email });

      if (!user) {
       await User.create(req.body, function (err, user) {
          if (err) {
            console.log("error in creating user while signing up", err);
            return;
          }

          req.flash('success', 'Signed Up Successfully!!');
          return res.redirect("/users/sign-in");
        });

      } else {
        req.flash('error', 'You have already signed up, login to continue!');
        return res.redirect("back");
      }
    } catch (err) {
 
      console.log("error in finding user in signing up", err);
      return;
    }
  } catch (err) {
    console.log("Error", err);
    return;
  }
};


/*
Route            /create-session
Description      performs signing in of Employee
Access           PUBLIC
Parameter        None
Methods          POST
*/
// sign in and create a session for the user
module.exports.createSession = async (req, res) => {

    req.flash('success', 'Logged In Successfully!!');
    return res.redirect("/");

};


/*
Route            /sign-out
Description      performs the signing out of Employee
Access           PUBLIC
Parameter        None
Methods          GET
*/

module.exports.destroySession = async (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log("error", err);
      return;
    }

    req.flash('success', 'Logged Out Successfully!')
    return res.redirect("/");
  });
};
