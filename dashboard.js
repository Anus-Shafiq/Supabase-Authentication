let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let company = document.getElementById("company");
let address = document.getElementById("address");
let email = document.getElementById("email");

let addUserBtn = document.getElementById("add-user-btn");

let userTableBody = document.getElementById("user_table_body");

async function userdata() {
  try {
    const { error } = await supabase.from("user").insert({
      first_name: firstName.value,
      last_name: lastName.value,
      company_name: company.value,
      address: address.value,
      email: email.value,
    });

    if (error) throw error;
    lastName.value = "";
    firstName.value = "";
    company.value = "";
    address.value = "";
    email.value = "";

    Swal.fire({
      title: "User Added",
      text: "User Sucesfully Added in the System",
      icon: "success",
    });

    userTableBody.innerHTML = "";
    getuser();
  } catch (error) {
    console.log(error);
  }
}

async function getuser() {
  try {
    const { data, error } = await supabase.from("user").select();
    if (error) throw error;

    userTableBody.innerHTML = "";

    if (data) {
      data.map((val, index) => {
        return (userTableBody.innerHTML += `
                    <tr>
                        <td scope="col">${val.first_name}</td>
                        <td scope="col">${val.last_name}</td>
                        <td scope="col">${val.company_name}</td>
                        <td scope="col">${val.email}</td>
                        <td scope="col">${val.address}</td>
                       <td> <span> <i id="delete_User" onclick="deleteUser(${val.id})" class="fa-solid fa-trash"></i> </span> </td>

                      </tr>
                `);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteUser(UserId) {
  try {
    Swal.fire({
      title: "Are you sure want to delete the user",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data, error } = await supabase
          .from("user")
          .delete()
          .eq("id", UserId)
          .select();

        if (error) throw error;
        if (data) {
          console.log("hello");
          Swal.fire({
            icon: "success",
            title: "User Deleted Succesfully ",
          });
          getuser();
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}

addUserBtn.addEventListener("click", userdata);

window.onload = getuser;

window.deleteUser = deleteUser;
