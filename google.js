let btn = document.getElementById("googleBtn");

async function login() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

btn.addEventListener("click", login);
