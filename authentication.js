let signupName = document.getElementById("signup_name");
let signupEmail = document.getElementById("signup_email");
let signupPass = document.getElementById("signup_pass");
let signupBtn = document.getElementById("signup_btn");
let btnText = document.getElementById("btnText");
let spinner = document.getElementById("spinner");
let profilePic = document.getElementById("profilePic");
let inputImage = document.getElementById("imageInput");

function getImg() {
  profilePic.src = URL.createObjectURL(inputImage.files[0]);
  profilePic.classList.add("h-100");
}
inputImage.addEventListener("change", getImg);

// Regex
var emailRegex = /^\S+@\S+\.\S+$/;

var nameRegex = /^[a-zA-Z0-9_ ]*$/;

// functions

async function signUp() {
  if (emailRegex.test(signupEmail.value)) {
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
        console.log(data.user.id);
        Swal.fire({
          title: "Sign Up",
          text: "Please Check Your Email for Confirmation",
          icon: "success",
        });

        try {
          const { data: userData, error: userError } = await supabase
            .from("usersData")
            .insert({
              userid: data.user.id,
              name: signupName.value,
              email: signupEmail.value,
            })
            .select();

          if (userError) throw userError;
          if (userData) {
            if (inputImage.files.length > 0) {
              let profileFile = inputImage.files[0];
              console.log(userData);
              console.log(profileFile);
              try {
                const { data: profileData, error: profileError } =
                  await supabase.storage
                    .from("profile-pic")
                    .upload(
                      `profile/${userData[0].id}_${profileFile.name}`,
                      profileFile,
                      {
                        cacheControl: "3600",
                        upsert: false,
                      }
                    );
                if (profileError) throw profileError;
                if (profileData) {
                  try {
                    const { data: profilePublicsUrl } = supabase.storage
                      .from("profile-pic")
                      .getPublicUrl(
                        `profile/${userData[0].id}_${profileFile.name}`
                      );
                    if (profilePublicsUrl) {
                      console.log(profilePublicsUrl.publicUrl);
                      try {
                        const {
                          data: profileUpdateData,
                          error: profileUpdateError,
                        } = await supabase
                          .from("usersData")
                          .update({ profilePic: profilePublicsUrl.publicUrl })
                          .eq("id", userData[0].id)
                          .select();
                        if (profileUpdateError) throw profileUpdateError;
                      } catch (error) {
                        console.log(error);
                      }
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }
              } catch (error) {
                console.log(error);
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      btnText.classList.remove("d-none");
      spinner.classList.add("d-none");
      window.location.href = "login.html";
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Wrong Email",
      text: "Please Enter Valid Email",
    });
  }
  profilePic.classList.remove("h-100");
}

signupBtn.addEventListener("click", signUp);
