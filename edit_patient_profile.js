$(document).ready(function(){

var errorMessage = $('.error-message')
const token = localStorage.getItem("token")

const userData = JSON.parse(localStorage.getItem("data"))

if(!userData) {
	var loc = `${$(location).attr('origin')}/care-giver/login`
	$(location).attr('href',loc)
}

if(userData.pictureURL) {
    $(".prof-img").attr("src", userData.pictureURL)
}

const userfullname = userData.fullName
$(".userfullname").html(`${userfullname}`)


$.get("https://restcountries.eu/rest/v2/all").done(function (data) {
   data.map( function (i) { 
   		$('.country-field').append(`<option value="${i.name}"> ${i.name} </option>`)
   })
   $(`select.country-field option:contains("${userData.country}")`).attr('selected', true)
})


function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

var patient_id = getUrlVars()["patient_id"]
console.log("patient id", patient_id)


// Patient Data

$.ajax({
				url: "https://aluuka-backend.herokuapp.com",
        contentType: "application/json",
        type:'POST',
        headers: { 'authorization': `Bearer ${JSON.parse(token)}` },
        data: JSON.stringify({ query: `query {
                                        getPatientById(
                                          id: "${patient_id}"
                                        ) {
                                          	id
                                            fullName
                                            email
                                            phone
                                            gender
                                            address
                                            country
                                            dob
                                        }
                                      }
                                    `
        }),
        success: function(result) {
        
        	const patient_data = result.data.getPatientById
          
            const options = {
                weekday: "short",
                year: "numeric",
                month:"short",
                day:"2-digit"
            }

            const main_date = new Date(patient_data.dob).toLocaleDateString("en-US",options)
            
            $(".dis_fname").html(patient_data.fullName)
            
            $(".edit_patient_profile_name").val(patient_data.fullName)
            $(".edit_patient_profile_dob").val(main_date)
            $(".edit_patient_profile_phone").val(patient_data.phone)
            $(".edit_patient_profile_email").val(patient_data.email)
            $(".edit_patient_profile_gender").val(patient_data.gender)
            $(".edit_patient_profile_address").val(patient_data.address)
            $(`select.edit_patient_profile_country option:contains("${userData.gender}")`).attr('selected', true)
            
            console.log(patient_data)
        },
        error: function(err) { 
            console.log(err)
        } 
})



$(".edit-patient-btn").click(function(event){
	event.preventDefault()

    const fullName = $(".edit_patient_profile_name").val()
    const dob = $(".edit_patient_profile_dob").val()
    const phone = $(".edit_patient_profile_phone").val()
    const email = $(".edit_patient_profile_email").val()
    const gender =  $("select.edit_patient_profile_gender option").filter(":selected").val()
    const country =  $("select.edit_patient_profile_country option").filter(":selected").val()
    const address = $(".edit_patient_profile_address").val()
    
    
    if (fullName === "" || dob === "" || gender === "" || country === "" || address === "" || phone === "" || email === "") {   
        $(".edit-patient-btn").html("Next: Patient Information")
        errorMessage.css("display", "block")
        errorMessage.css("background", "#c62828")
        errorMessage.html("Pls fill in all field....")
        errorMessage.animate({ top: "30px" }, 900, "linear", function() {
          console.log("All is cool")
        })
        errorMessage.animate({ top: "50px" }, 900, "linear", function() {
          console.log("All is cool")
        })
        setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
        return false;
    }

    $(".edit-patient-btn").html("Please wait....")
    $(".edit-patient-btn").text("Please wait....")

   
   	const valid_date = new Date(dob)

   	console.log(dob)
   	console.log("loading....")
    
     $.ajax({url: "https://aluuka-backend.herokuapp.com",
          contentType: "application/json",type:'POST',
          headers: { 'authorization': `Bearer ${JSON.parse(token)}` },
          data: JSON.stringify({ query: `mutation {
                                            updatePatient(
                                                id: "${patient_id}"
                                                fullName: "${fullName}"
                                                dob: "${valid_date}"
                                                gender: "${gender}"
                                                country: "${country}"
                                                address: "${address}"
                                                phone: "${phone}"
                                                email: "${email}"
                                                careGiverId: "${userData.id}"
                                          ) { 
                                                  success message returnStatus data token
                                              }
                                      }
                                      `
          }),
          success: function(result) {
              if(!result.data.updatePatient.success) {
                  $(".edit-patient-btn").html("Next: Patient Information")
                  $(".edit-patient-btn").text("Next: Patient Information")
                  errorMessage.css("display", "block")
                  errorMessage.css("background", "#c62828")
                  errorMessage.html(result.data.updatePatient.message)
                  errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
                  errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
                  setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
              } else {
              	$(".edit-patient-btn").html("Next: Patient Information")
                $(".edit-patient-btn").text("Next: Patient Information")
                  errorMessage.css("display", "block")
                  errorMessage.css("background", "#43a047")
                  errorMessage.html(result.data.updatePatient.message)
                  errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
                  errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool")  })
                  setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
                  localStorage.setItem('data', JSON.stringify(result.data.updatePatient.data))
                  var loc = `${$(location).attr('origin')}/care-giver/patient-profile-list`
                  $(location).attr('href',loc)
              }
              console.log(JSON.stringify(result.data))
          },
          error: function(err) {  console.log(err)  } 
      })
   	
})


})