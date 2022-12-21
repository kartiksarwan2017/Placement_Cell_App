const fetch = require('cross-fetch');


/*
Route            /jobs/list
Description      Renders the Placement Cell page
Access           PUBLIC
Parameter        None
Methods          GET
*/

module.exports.jobPage = async function (req, res) {
    try {
        const response = await fetch('https://remotive.com/api/remote-jobs');

        const jobsData = await response.json();
        
        return res.render('placementCell', {
            title: "Placement Cell",
            body : jobsData.jobs
        });
      
      } catch (err) {
        console.error(err);
      }
};
