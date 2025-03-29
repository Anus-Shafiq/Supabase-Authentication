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
        window.location.href = "/feed.html";
      }
    } else {
      if (!isAuthPage) {
        window.location.href = "/login.html";
      }
    }
  } catch (error) {
    console.log(error);
  }
  getUserDetails();
}

async function getUserDetails() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      console.log(user);
      try {
        const { data, error } = await supabase
          .from("usersData")
          .select("id, name, email,profilePic")
          .eq("userid", user.id);

        if (data) {
          console.log(data);
          let currentUser = {
            name: data[0].name,
            userId: user.id,
            id: data[0].id,
            email: data[0].email,
            userPic: data[0].profilePic,
          };
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

window.onload = checkSession;
