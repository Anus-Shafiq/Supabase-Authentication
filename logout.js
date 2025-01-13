let logOutBtn = document.getElementById("logoutBtn");

async function logout() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    window.location.href = "/login.html";
  } catch (error) {
    console.log(error);
  }
}

logOutBtn.addEventListener("click", logout);
