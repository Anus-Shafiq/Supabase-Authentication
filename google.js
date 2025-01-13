let btn = document.getElementById("googleBtn");

async function login() {
  try {
    const { error } = awaitsupabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) throw error;
  } catch (error) {
    console.log(error);
  } finally {
  }
}

btn.addEventListener("click", login);
