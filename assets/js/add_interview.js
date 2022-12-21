{
    // method to submit the form data for new interview using AJAX
   let createInterview = function(){
    let newInterviewForm = $('#new-interview-form');

    newInterviewForm.submit(function(e){
        e.preventDefault();

        $.ajax({
            type: 'post',
            url:'/interview/create-interview',
            data: newInterviewForm.serialize(),
            success: function(data){
                console.log(data);

                new Noty({
                    theme: 'relax',
                    text: "Interview Slot Added Successfully!",
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

   createInterview();
}