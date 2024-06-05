$(document).ready(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        alert("Vous devez être connecté pour accéder à cette page.");
        window.location.href = "../login/login.html";
    }

    $("#firstname").val(user.PRENOM);
    $("#lastname").val(user.NOM);
    $("#email").val(user.EMAIL);

    $(".inputBox input").each(function() {
        if ($(this).val() !== "") {
            $(this).siblings("label").css({
                top: "-20px",
                fontSize: "12px",
                color: "#03a9f4"
            });
        }
    });

    $(".inputBox input").on("focus", function() {
        $(this).siblings("label").css({
            top: "-20px",
            fontSize: "12px",
            color: "#03a9f4"
        });
    });

    $(".inputBox input").on("blur", function() {
        if ($(this).val() === "") {
            $(this).siblings("label").css({
                top: "10px",
                fontSize: "16px",
                color: "#000"
            });
        }
    });

    $("#profile-form").submit(event => {
        event.preventDefault();

        const PRENOM = $("#firstname").val();
        const NOM = $("#lastname").val();
        const EMAIL = $("#email").val();
        const PWD = $("#password").val();

        $.ajax({
            url: "../php/profile.php",
            type: "POST",
            dataType: "json",
            data: {
                PRENOM,
                NOM,
                EMAIL,
                PWD
            },
            success: (res) => {
                if (res.success) {
                    alert("Profil mis à jour avec succès.");
                    user.PRENOM = PRENOM;
                    user.NOM = NOM;
                    user.EMAIL = EMAIL;
                    localStorage.setItem("user", JSON.stringify(user));
                } else {
                    alert(res.error);
                }
            },
            error: () => {
                alert("Une erreur s'est produite. Veuillez réessayer.");
            }
        });
    });

    $("#logout").click(() => {
        localStorage.removeItem("user");
        window.location.href = "../index/index.html";
    });
});
