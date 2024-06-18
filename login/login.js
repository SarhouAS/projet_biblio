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
                    if (res.user.role === "admin") {
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

    document.getElementById('togglePassword').addEventListener('click', function (e) {
        const password = document.getElementById('password');
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });
});
