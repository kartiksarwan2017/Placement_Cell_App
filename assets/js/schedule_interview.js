{
   // method to submit data for schedule Interview Slot Form using AJAX
   let createInterviewSlot = function(){
    let scheduleNewInterview = $('#schedule-new-interview-form');

    scheduleNewInterview.submit(function(e){
        e.preventDefault();

        const id = e.target.getAttribute("data-id");
       
        $.ajax({
            type: 'post',
            url: `/interview/add-student-interview/${id}`,
            data: scheduleNewInterview.serialize(),
            success: function(data){
                console.log(data);
                new Noty({
                    theme: 'relax',
                    text: "Interview Scheduled Successfully!",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();
            },
            error: function(error){
                console.log(error.responseText);
            }
        });
    });  
   }

   createInterviewSlot();

}