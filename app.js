async function checkSession() {
  try {
    const { data, error } = await supabase.auth.getSession();

    const authPages = ["/index.html", "/login.html", "/"];
    const currentPath = window.location.pathname;
    console.log(currentPath);
    const isAuthPage = authPages.some((page) => page.includes(currentPath));

    const { session } = data;

    if (session) {
      if (isAuthPage) {
        window.location.href = "/dashboard.html";
      }
    } else {
      if (!isAuthPage) {
        window.location.href = "/login.html";
      }
    }
  } catch (error) {
    console.log(error);
  }
}

window.onload = checkSession;
