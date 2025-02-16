let postContent = document.getElementById("postContent");
let postFile = document.getElementById("postFile");
let postButton = document.getElementById("postBtn");
let postsContainer = document.getElementById("posts-container");

async function addPost() {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log(currentUser);
  try {
    const { data, error } = await supabase
      .from("posts")
      .insert({
        content: postContent.value,
        userId: currentUser.userId,
        name: currentUser.name,
      })
      .select();

    if (error) throw error;
    if (data) {
      console.log(data);
      if (postFile.files.length > 0) {
        let currentFile = postFile.files[0];
        console.log(currentFile);
        try {
          const { data: imagestoreData, error: imageStoreError } =
            await supabase.storage
              .from("postData")
              .upload(`Posts/${data[0].id}_${currentFile.name}`, currentFile, {
                cacheControl: "3600",
                upsert: false,
              });

          if (imageStoreError) throw imageStoreError;
          if (imagestoreData) {
            console.log(imagestoreData);
            try {
              const { data: publicUrlData } = supabase.storage
                .from("postData")
                .getPublicUrl(`Posts/${data[0].id}_${currentFile.name}`);

              if (publicUrlData) {
                console.log(publicUrlData.publicUrl);

                try {
                  const { data: postUpdateData, error: postUpdateError } =
                    await supabase
                      .from("posts")
                      .update({ imageURL: publicUrlData.publicUrl })
                      .eq("id", data[0].id)
                      .select();

                  if (postUpdateError) throw postUpdateError;
                  if (postUpdateData) {
                    postContent.value = "";
                    postFile.value = "";
                  }
                } catch (error) {
                  console.log(error);
                } finally {
                  postsContainer.innerHTML = "";
                  postLoad();
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

async function postLoad() {
  try {
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select();

    if (postError) throw postError;
    if (postData) {
      console.log(postData);
      try {
        const { data: userData, error: userError } = await supabase
          .from("usersData")
          .select();

        if (userError) throw error;
        if (userData) {
          console.log(userData);
          let userMap = {};

          userData.forEach((user) => {
            console.log(user);
            userMap[user.userid] = user;
            console.log(userMap);
          });

          var myId = JSON.parse(localStorage.getItem("currentUser"));
          console.log(myId);

          let myPost = false;

          postData.forEach((post) => {
            console.log(post);
            let currentUser = userMap[post.userId];
            console.log(currentUser.userid);
            console.log(myId.userId);

            if (currentUser.userid === myId.userId) {
              console.log(currentUser);
              console.log(myId);
              myPost = true;
            }

            postsContainer.innerHTML += `

            <div class="card w-100 my-2">

                     <div class="card-header d-flex gap-2 align-items-center justify-content-between">
                     <div class="d-flex align-items-center gap-2">
                     <div>
                             <img class="mt-1" src="user.png" width="30" height="30" alt="">
                         </div>
                         <div class="d-flex flex-column ">
                             <h5 class="card-title p-0 m-0 text-capitalize">${
                               currentUser.name
                             }</h5>
                             <small> ${new Date(
                               post.created_at
                             ).toLocaleString()}  </small>
                         </div>
                     </div>
        
                         


                         <div> ${
                           myPost
                             ? `
                             <div class="dropdown">
  <button class="btn btn-light " type="button" data-bs-toggle="dropdown" aria-expanded="false">
    <i class="fa-solid fa-ellipsis-vertical text-primary"></i>
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#" onclick="deleteMyPost(${post.id})">Delete</a></li>
    
  </ul>
</div>`
                             : ""
                         }
                         </div>
                        
                     </div>
                     <div class="card-body">

                         <p class="card-text"> ${post.content}
                         </p>
                         <img style="width: 100%; "
                             src="${post.imageURL}"
                             alt="">
                     </div>
                 </div>
           `;
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteMyPost(postId) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .select();

    if (error) throw error;

    if (data) {
      postsContainer.innerHTML = "";
      postLoad();
    }
  } catch (error) {
    console.log(error);
  }
}

window.deleteMyPost = deleteMyPost;

window.onload = postLoad();

postButton.addEventListener("click", addPost);
