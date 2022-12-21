{
    // method to submit the form data for new student using AJAX
   let createStudent = async function(){
    let newStudentForm = $('#new-student-form');

    newStudentForm.submit(function(e){
        e.preventDefault();

        $.ajax({
            type: 'post',
            url:'/student/create-student',
            data: newStudentForm.serialize(),
            success: function(data){
                console.log(data);
                new Noty({
                    theme: 'relax',
                    text: "Student Added Sucessfully!",
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

   createStudent();
}











