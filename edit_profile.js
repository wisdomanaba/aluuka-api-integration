$(document).ready(function(){

var errorMessage = $('.error-message')
const token = localStorage.getItem("token")
const userData = JSON.parse(localStorage.getItem("data"))

if(!userData) {
	var loc = `${$(location).attr('origin')}/care-giver/login`
	$(location).attr('href',loc)
}

const userfullname = userData.fullName
var firstName = userfullname.replace(/ .*/, '')

$(".firstname").html(`Welcome, ${firstName}`)
$(".userfullname").html(`${userfullname}`)


$(".sign-out").click(function(){
	localStorage.clear()
	var loc = `${$(location).attr('origin')}/care-giver/login`
	$(location).attr('href',loc)
})

$.get("https://restcountries.eu/rest/v2/all").done(function (data) {
   data.map( function (i) { 
   		$('.onboarding_complete_country').append(`<option value="${i.name}"> ${i.name} </option>`)
   })
   $(`select.onboarding_complete_country option:contains("${userData.country}")`).attr('selected', true)
})

const updateFields = (image_url) => {

    $.ajax({url: "https://aluuka-backend.herokuapp.com",
        contentType: "application/json",type:'POST',
        headers: { 'authorization': `Bearer ${JSON.parse(token)}` },
        data: JSON.stringify({ query: `mutation ($notf: [NotificationChannel]!){ 
                                        onboardingCompleteProfile(
                                            fullName: "${userData.fullName}" pictureURL: "${image_url}" dob: "${userData.dob}" gender: "${userData.gender}" country: "${userData.country}" address: "${userData.address}" phone: "${userData.phone}" email: "${userData.email}" notificationChannel: $notf
                                        ) { 
                                            success message returnStatus data
                                        }
                                    }`,
                                    variables: {
                                        "notf": userData.notificationChannel
                                    }
    }),
        success: function(result) {
            if(!result.data.onboardingCompleteProfile.success) {
                errorMessage.css("display", "block")
                errorMessage.css("background", "#c62828")
                errorMessage.html(result.data.onboardingCompleteProfile.message)
                errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
                errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
                setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
                $("mpe-button-replace-image").html("Replace Image")
                return false;
            } else {
                errorMessage.css("display", "block")
                errorMessage.css("background", "#43a047")
                errorMessage.html(result.data.onboardingCompleteProfile.message)
                errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
                errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
                setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
                localStorage.setItem('data', JSON.stringify(result.data.onboardingCompleteProfile.data))
                $("mpe-button-replace-image").html("Plesae wait..")
            }
        },
        error: function(err) { console.log("err:",err) }
    })

}

$(".mpe-profile-buttons").prepend(`
    <input type="file" id="change_img" name="change_img" accept="image/png, image/jpeg" style="display:none"/>
    <label for="change_img" class="mpe-button-replace-image" style="color:#fff; cursor: pointer;">Replace Image</label>
`)

$('#change_img').change(function(e) {
    var fileName = e.target.files[0]
	if(!fileName) {
        return false
    }
    console.log("Files name", fileName)
    $("mpe-button-replace-image").html("Plesae wait..")
    const data = new FormData()
    data.append("file",fileName)
    data.append("upload_preset","s0qhad82")
    data.append("cloud_name","cnq")
    fetch("https://api.cloudinary.com/v1_1/devwian/image/upload",{ method:"post", body:data})
    .then(res=>res.json())
    .then(data_res=>{
        const img_url = data_res.url
        console.log('Image URL', img_url)
        updateFields(img_url)
    })
    .catch(err=>{
        console.log("Upload error", err)
        $("mpe-button-replace-image").html("Replace Image")
    })

})

const options = { weekday: "short", year: "numeric", month:"short", day:"2-digit" }
const main_date = new Date(userData.dob).toLocaleDateString("en-US",options)

$(".onboarding_complete_fullname").attr("value", `${userfullname}`)
$(".onboarding_complete_address").attr("value", `${userData.address}`)
$(".onboarding_complete_email").attr("value", `${userData.email}`)
$(".onboarding_complete_phone").attr("value", `${userData.phone}`)
$(`select.onboarding_complete_gender option:contains("${userData.gender}")`).attr('selected', true)
if(userData.notificationChannel.includes("email")) {
	$('#notfemail').attr('checked', true)
}
if(userData.notificationChannel.includes("phone")) {
	$('#notfphone').attr('checked', true)
}

// Edit Profile
$(".onboard-comp-submit").click(function(event){
	event.preventDefault()
	const fullName = $(".onboarding_complete_fullname").val()
    const dob = $(".create_patient_dob").val()
    const gender = $("select.onboarding_complete_gender option").filter(":selected").val()
    const country = $("select.onboarding_complete_country option").filter(":selected").val()
    const address = $(".onboarding_complete_address").val()
    const phone = $(".onboarding_complete_phone").val()
    const email = $(".onboarding_complete_email").val()
    var notf = []
    if($("#notfemail").prop('checked')) {
    	console.log("Yeah, you check email")
        notf.push("email")
    } else {
    	console.log("No, you did not check email")
    }
   	if($("#notfphone").prop('checked')) {
    	console.log("Yeah, you check Phone")
        notf.push("phone")
    } else {
    	console.log("No, you did not check phone")
    }
    
    
    if (fullName === "" || dob === "" || gender === "" || country === "" || address === "" || phone === "" || email === "") {   
        $(".onboard-comp-submit").html("Next: Patient Information")
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

    $(".onboard-comp-submit").html("Please wait....")
   
   	const valid_date = new Date(dob)

   	console.log(dob)
   	console.log(fullName,valid_date,gender,country,address,phone,email,notf)
   	console.log("loading....")
    
     $.ajax({url: "https://aluuka-backend.herokuapp.com",
          contentType: "application/json",type:'POST',
          headers: { 'authorization': `Bearer ${JSON.parse(token)}` },
          data: JSON.stringify({ query: `mutation {
                                          onboardingCompleteProfile(
                                              fullName: "${fullName}"
                                              dob: "${valid_date}"
                                              gender: "${gender}"
                                              country: "${country}"
                                              address: "${address}"
                                              phone: "${phone}"
                                              email: "${email}"
                                              notificationChannel: ${notf}
                                          ) { 
                                                  success message returnStatus data token
                                              }
                                      }
                                      `
          }),
          success: function(result) {
              if(!result.data.onboardingCompleteProfile.success) {
                  $(".onboard-comp-submit").html("Next: Patient Information")
                  errorMessage.css("display", "block")
                  errorMessage.css("background", "#c62828")
                  errorMessage.html(result.data.onboardingCompleteProfile.message)
                  errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
                  errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
                  setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
              } else {
              	$(".onboard-comp-submit").html("Next: Patient Information")
                  errorMessage.css("display", "block")
                  errorMessage.css("background", "#43a047")
                  errorMessage.html(result.data.onboardingCompleteProfile.message)
                  errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
                  errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool")  })
                  setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
                  localStorage.setItem('data', JSON.stringify(result.data.onboardingCompleteProfile.data))
                  var loc = `${$(location).attr('origin')}/care-giver/treatments-main-dashboard`
                  $(location).attr('href',loc)
              }
              console.log(JSON.stringify(result.data))
          },
          error: function(err) {  console.log(err)  } 
      })
   	
})

})