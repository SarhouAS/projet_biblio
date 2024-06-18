$("form").submit(event => { 
    event.preventDefault();

    // Vérifiez si la case à cocher est cochée
    if (!$('#acceptTerms').is(':checked')) {
        alert('Vous devez accepter les conditions de confidentialité pour continuer.');
        return;
    }

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
            ROLE: $("#role").val(),
            acceptTerms: $("#acceptTerms").is(':checked') ? 'on' : ''
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
