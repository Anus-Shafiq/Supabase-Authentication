let btn = document.getElementById("googleBtn");

async function login() {
  try {
    const { data, error } = awaitsupabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) throw error;
    if (data) {
      Swal.fire({
        title: "Log In",
        text: "Log In Successfully",
        icon: "success",
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    window.location.href = "dashboard.html";
  }
}

btn.addEventListener("click", login);
