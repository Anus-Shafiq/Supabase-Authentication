let currentUser = JSON.parse(localStorage.getItem("currentUser"));
let postContent = document.getElementById("postContent");
let postButton = document.getElementById("postBtn");
let postsContainer = document.getElementById("posts-container");
let postImage = document.getElementById("postImage");
let inputImage = document.getElementById("imageInput");
let userPic = document.getElementById("userPic");

userPic.src = currentUser.userPic
  ? currentUser.userPic
  : "./assets/profile.png";

function getImg() {
  postImage.src = URL.createObjectURL(inputImage.files[0]);
  postImage.classList.remove("d-none");
}

inputImage.addEventListener("change", getImg);

async function addPost() {
  console.log(currentUser);
  // insert data in posts table
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
      // checked in there is any image in post
      if (inputImage.files.length > 0) {
        let currentFile = inputImage.files[0];
        7;

        console.log(currentFile);
        try {
          const { data: imagestoreData, error: imageStoreError } =
            await supabase.storage
              .from("postdata")
              .upload(`Posts/${data[0].id}_${currentFile.name}`, currentFile, {
                cacheControl: "3600",
                upsert: false,
              });

          if (imageStoreError) throw imageStoreError;
          // get public URL
          if (imagestoreData) {
            console.log(imagestoreData);
            try {
              const { data: publicUrlData } = supabase.storage
                .from("postdata")
                .getPublicUrl(`Posts/${data[0].id}_${currentFile.name}`);

              // update URL in posts table
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
                    inputImage.value = "";
                  }
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
  postContent.value = "";
  inputImage.value = "";
  postImage.classList.add("d-none");
  postsContainer.innerHTML = "";
  postLoad();
}

// post load function
async function postLoad() {
  // get posts from posts table
  try {
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select();

    if (postError) throw postError;
    // get data of users from users table
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

          // get post for render
          postData.reverse().forEach((post) => {
            console.log(post);

            let currentUser = userMap[post.userId];
            console.log(currentUser);
            console.log(currentUser.userid);
            console.log(myId.userId);

            // post updation
            postsContainer.innerHTML += `

            <div class="card w-100 my-2">

                     <div class="card-header d-flex gap-2 align-items-center justify-content-between">
                     <div class="d-flex align-items-center gap-2">
                     <div>
                             <img class=" rounded-circle" src="${
                               currentUser.profilePic
                                 ? currentUser.profilePic
                                 : "./assets/profile.png"
                             }" width="50" height="50" alt="">
                         </div>
                         <div class="d-flex flex-column ">
                             <h5 class="card-title p-0 m-0 text-capitalize">${
                               currentUser.name
                             }</h5>
                             <small class=" text-black-50"> <i class="fa fa-history"></i>
                            ${(() => {
                              let diff = Math.floor(
                                (new Date() - new Date(post.created_at)) / 1000
                              );
                              if (diff < 60) return diff + " secs ago";
                              diff = Math.floor(diff / 60);
                              if (diff < 60) return diff + " mins ago";
                              diff = Math.floor(diff / 60);
                              if (diff < 24) return diff + " hr ago";
                              diff = Math.floor(diff / 24);
                              if (diff < 30) return diff + " days ago";
                              return Math.floor(diff / 30) + " months ago";
                            })()} </small>
                         </div>
                     </div>
        
                         


                         <div> ${
                           currentUser.userid === myId.userId
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

                         <p class="card-text m-0"> ${post.content}
                         </p>
                        <img style="width: 100%; "
                            class="mt-2"
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

// delete post function
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
