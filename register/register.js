$("form").submit(event => { 
    event.preventDefault();

    $.ajax({
        url: "../php/register.php",
        type: "POST",
        dataType: "json",
        data: { 
            PRENOM: $("#firstname").val(),
            NOM: $("#lastname").val(),
            EMAIL: $("#email").val(),
            PWD: $("#password").val(),
            confirm_password: $("#confirm_password").val(),
            ROLE: $("#role").val()
        },
        success: (res) => {
            if (res.success) {
                alert(res.message);
                window.location.replace("../login/login.html");
            } else {
                alert(res.error);
            }
        }
    });
});
