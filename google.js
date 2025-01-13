let btn = document.getElementById("googleBtn");

async function login() {
  supabase.auth.signInWithOAuth({
    provider: "google",
  });
}

btn.addEventListener("click", login);
