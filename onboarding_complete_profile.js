$(document).ready(function(){

var errorMessage = $('.error-message')

const token = localStorage.getItem("token")
const userData = JSON.parse(localStorage.getItem("data"))

if(!token) {
	var loc = `${$(location).attr('origin')}/sign-up`
	$(location).attr('href',loc)
}

$.get("https://restcountries.eu/rest/v2/all").done(function (data) {
   data.map( function (i) { 
   		$('.onboarding_complete_country').append(`<option value="${i.name}"> ${i.name} </option>`)
   })
})

// Upload Image

const updateFields = (image_url) => {

    if(!userData) {

        $.ajax({url: "https://aluuka-backend.herokuapp.com",
            contentType: "application/json",type:'POST',
            headers: { 'authorization': `Bearer ${JSON.parse(token)}` },
            data: JSON.stringify({ query: `mutation ($notf: [NotificationChannel]!){ 
                                            onboardingCompleteProfile(
                                                fullName:" " pictureURL:"${image_url}" dob:" " gender:" " country:" " address:" " phone:" " email:" " notificationChannel: $notf
                                            ) { 
                                                success message returnStatus data
                                            }
                                        }`,
                                        variables: {
                                            "notf": []
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
                    $(".image-label").html("Replace Image")
                    $(".image-label").text("Replace Image")
                    $(".image-label").value("Replace Image")
                    return false;
                } else {
                    errorMessage.css("display", "block")
                    errorMessage.css("background", "#43a047")
                    errorMessage.html(result.data.onboardingCompleteProfile.message)
                    errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
                    errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
                    setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
                    localStorage.setItem('data', JSON.stringify(result.data.onboardingCompleteProfile.data))
                    $(".image-label").html("Replace Image")
                    $(".image-label").text("Replace Image")
                    $(".image-label").value("Replace Image")
                }
            },
            error: function(err) { console.log("err:",err) }
        })

    }

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
                $(".image-label").html("Replace Image")
                $(".image-label").text("Replace Image")
                $(".image-label").value("Replace Image")
            }
        },
        error: function(err) { console.log("err:",err) }
    })

}

$(".rep-img").prepend(`
    <input type="file" id="change_img" name="change_img" accept="image/png, image/jpeg" style="display:none"/>
    <label for="change_img" class="button-medium w-button image-label" style="color:#fff; cursor: pointer;">Replace Image</label>
`)

$('#change_img').change(function(e) {
    var fileName = e.target.files[0]
	if(!fileName) {
        return false
    }
    console.log("Files name", fileName)
    $(".image-label").html("Plesae wait..")
    $(".image-label").text("Please wait....")
    $(".image-label").value("Please wait....")
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
        $(".image-label").html("Replace Image")
        $(".image-label").text("Replace Image")
        $(".image-label").value("Replace Image")
    })

    
})

// End Upload Image


var notf = []
var notfemail = false;
var notfphone = false;

$("#notfemail").click(function(event){

    if(!notfemail) {
        notfemail = true
        notf.push("email")
        console.log("notfemail",notfemail)
        console.log("notf",notf)
    } else {
        notfemail = false
        notf = notf.filter(notfItem => notfItem !== "email")
        console.log("notfemail",notfemail)
        console.log("notf",notf)
    }

})


$("#notfphone").click(function(event){

    if(!notfphone) {
        notfphone = true
        notf.push("phone")
        console.log("notfphone",notfphone)
        console.log("notf",notf)
    } else {
        notfphone = false
        notf = notf.filter(notfItem => notfItem !== "phone")
        console.log("notfphone",notfphone)
        console.log("notf",notf)
    }

})


// Complete Profile
$(".onboard-comp-submit").click(function(event){
	event.preventDefault()
	const fullName = $(".onboarding_complete_fullname").val()
    const dob = $(".onboarding_complete_dob").val()
    const gender = $("select.onboarding_complete_gender option").filter(":selected").val()
    const country = $("select.onboarding_complete_country option").filter(":selected").val()
    const address = $(".onboarding_complete_address").val()
    const phone = $(".onboarding_complete_phone").val()
    const email = $(".onboarding_complete_email").val()
    $(".onboard-comp-submit").text("Please wait....")
    $(".onboard-comp-submit").value("Please wait....")
    
    console.log("main trial", notf)
    
    if (fullName === "" || dob === "" || gender === "" || country === "" || address === "" || phone === "" || email === "") {   
        $(".onboard-comp-submit").text("Next: Patient Information")
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
   
   	const valid_date = new Date(dob)
   
   	console.log(fullName,valid_date,gender,country,address,phone,email, notf)
   	console.log("loading....")
    
     $.ajax({url: "https://aluuka-backend.herokuapp.com",
          contentType: "application/json",type:'POST',
          headers: { 'authorization': `Bearer ${JSON.parse(token)}` },
          data: JSON.stringify({ query: `mutation ($notificationChannel: [NotificationChannel]!){
                                          onboardingCompleteProfile(
                                              fullName: "${fullName}"
                                              dob: "${valid_date}"
                                              gender: "${gender}"
                                              country: "${country}"
                                              address: "${address}"
                                              phone: "${phone}"
                                              email: "${email}"
                                              notificationChannel: $notificationChannel
                                          ) { 
                                                  success message returnStatus data token
                                              }
                                      }`,
                                      variables: {
                                        "notificationChannel": notf
                                      }
          }),
          success: function(result) {
              if(!result.data.onboardingCompleteProfile.success) {
                  $(".onboard-comp-submit").text("Next: Patient Information")
                  errorMessage.css("display", "block")
                  errorMessage.css("background", "#c62828")
                  errorMessage.html(result.data.onboardingCompleteProfile.message)
                  errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
                  errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
                  setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
              } else {
                $(".onboard-comp-submit").text("Next: Patient Information")
                  errorMessage.css("display", "block")
                  errorMessage.css("background", "#43a047")
                  errorMessage.html(result.data.onboardingCompleteProfile.message)
                  errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
                  errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool")  })
                  setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
                  localStorage.setItem('data', JSON.stringify(result.data.onboardingCompleteProfile.data))
                  var loc = `${$(location).attr('origin')}/care-giver/patient-profile-3`
                  $(location).attr('href',loc)
                }
                console.log(JSON.stringify(result.data))
          },
          error: function(err) {  console.log(err)  } 
      })
   	
})



})