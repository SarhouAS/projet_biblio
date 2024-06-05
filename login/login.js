document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("logout")) {
        $.ajax({
            url: "../php/logout.php",
            type: "GET",
            dataType: "json",
            success: () => {
                localStorage.removeItem("user");
            }
        });
    }

    $("form").submit((event) => {
        event.preventDefault();

        $.ajax({
            url: "../php/login.php",
            type: "POST",
            dataType: "json",
            data: {
                EMAIL: $("#email").val(),
                PWD: $("#password").val()
            },
            success: (res) => {
                if (res.success) {
                    localStorage.setItem("user", JSON.stringify(res.user));
                    alert("Connexion réussie !");
                    if (res.user.role === "admin") { // Vérification du rôle ici
                        window.location.replace("../admin/dashboard.html");
                    } else {
                        window.location.replace("../index/index.html");
                    }
                } else {
                    alert(res.error);
                }
            }
        });
    });

    $("i").click(() => {
        if ($("#password").attr("type") === "password") {
            $("i").removeClass("fa-eye").addClass("fa-eye-slash");
            $("#password").attr("type", "text");
        } else {
            $("i").removeClass("fa-eye-slash").addClass("fa-eye");
            $("#password").attr("type", "password");
        }
    });
});
