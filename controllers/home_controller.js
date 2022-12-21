/*
Route            /
Description      Home Page
Access           PUBLIC
Parameter        None
Methods          GET
*/

module.exports.home = async (req, res) => {

    return res.render('home', {
        title: "Placement Cell App"
    });
    
}

