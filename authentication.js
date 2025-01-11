let signupName = document.getElementById("signup_name");
let signupEmail = document.getElementById("signup_email");
let signupPass = document.getElementById("signup_pass");
let signupBtn = document.getElementById("signup_btn");
let btnText = document.getElementById("btnText");
let spinner = document.getElementById("spinner");

async function signUp() {
  try {
    btnText.classList.add("d-none");
    spinner.classList.remove("d-none");
    const { data, error } = await supabase.auth.signUp({
      email: signupEmail.value,
      password: signupPass.value,

      options: {
        data: {
          first_name: signupName.value,
        },
      },
    });

    if (error) throw error;
    if (data) {
      Swal.fire({
        title: "Sign Up",
        text: "Please Check Your Email for Confirmation",
        icon: "success",
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    btnText.classList.remove("d-none");
    spinner.classList.add("d-none");
    window.location.href = "login.html";
  }
}

signupBtn.addEventListener("click", signUp);
