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
  } catch (error) {
    console.log(error);
  }
}

async function getuser() {
  try {
    const { data, error } = await supabase.from("user").select();
    if (error) throw error;

    if (data) {
      data.map((val, index) => {
        return (userTableBody.innerHTML += `
                    <tr>
                        <td scope="col">${val.first_name}</td>
                        <td scope="col">${val.last_name}</td>
                        <td scope="col">${val.company_name}</td>
                        <td scope="col">${val.email}</td>
                        <td scope="col">${val.address}</td>
                        
                      </tr>
                `);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

addUserBtn.addEventListener("click", userdata);

window.onload = getuser();
