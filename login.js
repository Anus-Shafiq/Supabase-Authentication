let loginEmail = document.getElementById("login_email");
let loginPass = document.getElementById("login_pass");
let loginBtn = document.getElementById("login_btn");

async function logIn() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail.value,
      password: loginPass.value,
    });

    if (error) throw error;
    if (data) {
      Swal.fire({
        title: "Log In",
        text: "Log In Successfully",
        icon: "success",
      });
    }
    return data;
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      title: error.message,
      text: "Something went wrong!",
    });
  } finally {
    window.location.href = "dashboard.html";
  }
}
loginBtn.addEventListener("click", logIn);
