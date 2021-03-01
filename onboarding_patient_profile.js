$(document).ready(function(){

var errorMessage = $('.error-message')
const token = localStorage.getItem("token")

$.get("https://restcountries.eu/rest/v2/all").done(function (data) {
   data.map( function (i) { 
   		$('.create_patient_country').append(`<option value="${i.name}"> ${i.name} </option>`)
   })
})

$('.create_patient_fullname').keyup(function(event) {
    newText = event.target.value
    $('.print_fname').text(newText)
})

$(".div-block-form-stage").css("background", "#185f56")
$(".div-block-form-stage-copy").css("background", "#185f56")


$(".create_patient_dob").attr("type","date")

// Create Patient
$(".create-patient-submit").click(function(event){

	event.preventDefault()
    
	const fullName = $(".create_patient_fullname").val()
    const dob = $(".create_patient_dob").val()
    const gender = $("select.create_patient_gender option").filter(":selected").val()
    const country = $("select.create_patient_country option").filter(":selected").val()
    const address = $(".create_patient_address").val()
    const phone = $(".create_patient_phone").val()
    const email = $(".create_patient_email").val()
    var consent = false
    
    $(".create-patient-submit").val("Please wait....")
    
   
    if($("#create_patient_consent").prop('checked')) {
    	console.log("Yeah, you check consent")
        consent = true
    }
    
    if (fullName === "" || dob === "" || gender === "" || country === "" || address === "" || phone === "" || email === "") {   
        $(".create-patient-submit").val("Proceed")
        errorMessage.css("display", "block")
        errorMessage.css("background", "#c62828")
        errorMessage.html("Pls fill in all field....")
        errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
        errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
        setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
        return false;
    }

    if (!consent) {   
        $(".create-patient-submit").val("Proceed")
        errorMessage.css("display", "block")
        errorMessage.css("background", "#c62828")
        errorMessage.html("Accept Legal consent is required....")
        errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
        errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
        setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
        return false;
    }

    const valid_date = new Date(dob)
    var CurrentDate = new Date();

    if(valid_date > CurrentDate){
        $(".create-patient-submit").val("Proceed")
        errorMessage.css("display", "block")
        errorMessage.css("background", "#c62828")
        errorMessage.html("Invalid date of birth....")
        errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
        errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
        setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
        return false;
    }

   
   	console.log(fullName,dob,gender,country,address,phone,email,consent)
   	console.log("loading....")
    
    
    $.ajax({url: "https://aluuka-backend.herokuapp.com",
          contentType: "application/json",
          type:'POST',
          headers: { 'authorization': `Bearer ${JSON.parse(token)}` },
          data: JSON.stringify({ query: `mutation {
                                          createPatient(
                                              fullName: "${fullName}"
                                              dob: "${valid_date}"
                                              gender: "${gender}"
                                              country: "${country}"
                                              address: "${address}"
                                              phone: "${phone}"
                                              email: "${email}"
                                              acceptLegalConsent: ${consent}
                                          ) { 
                                                  success
                                                  message
                                                  data
                                              }
                                      }
                                      `
          }),
          success: function(result) {
              if(!result.data.createPatient.success) {
                  errorMessage.css("display", "block")
                  errorMessage.css("background", "#c62828")
                  errorMessage.html(result.data.createPatient.message)
                  errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
                  errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
                  setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
              } else {
                  errorMessage.css("display", "block")
                  errorMessage.css("background", "#43a047")
                  errorMessage.html(result.data.createPatient.message)
                  errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
                  errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
                  setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
                  var loc = `${$(location).attr('origin')}/care-giver/treatments-main-dashboard`
                  $(location).attr('href',loc)
              }
              console.log(JSON.stringify(result.data))
          },
          error: function(err) { 
              console.log(err)
          } 
      })
      
    
})



var pat_arr = []


// add patient

$(".button-plain-icon").click(function(event){

	event.preventDefault()
    
	const fullName = $(".create_patient_fullname").val()
    const dob = $(".create_patient_dob").val()
    const gender = $("select.create_patient_gender option").filter(":selected").val()
    const country = $("select.create_patient_country option").filter(":selected").val()
    const address = $(".create_patient_address").val()
    const phone = $(".create_patient_phone").val()
    const email = $(".create_patient_email").val()
    var consent = false
    
    $(".button-plain-icon .heading-5-alt").text("Please wait....")
    
   
    if($("#create_patient_consent").prop('checked')) {
    	console.log("Yeah, you check consent")
        consent = true
    }
    
    if (fullName === "" || dob === "" || gender === "" || country === "" || address === "" || phone === "" || email === "") {   
        $(".button-plain-icon .heading-5-alt").text("Add patient")
        errorMessage.css("display", "block")
        errorMessage.css("background", "#c62828")
        errorMessage.html("Pls fill in all field....")
        errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
        errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
        setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
        return false;
    }

    if (!consent) {   
        $(".button-plain-icon .heading-5-alt").text("Add patient")
        errorMessage.css("display", "block")
        errorMessage.css("background", "#c62828")
        errorMessage.html("Accept Legal consent is required....")
        errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
        errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
        setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
        return false;
    }

    const valid_date = new Date(dob)
    var CurrentDate = new Date();

    if(valid_date > CurrentDate){
        $(".button-plain-icon .heading-5-alt").text("Add patient")
        errorMessage.css("display", "block")
        errorMessage.css("background", "#c62828")
        errorMessage.html("Invalid date of birth....")
        errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
        errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
        setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
        return false;
    }
   
   	console.log(fullName,valid_date,gender,country,address,phone,email,consent)
   	console.log("loading....")
    
    
    $.ajax({url: "https://aluuka-backend.herokuapp.com",
          contentType: "application/json",
          type:'POST',
          headers: { 'authorization': `Bearer ${JSON.parse(token)}` },
          data: JSON.stringify({ query: `mutation {
                                          createPatient(
                                              fullName: "${fullName}"
                                              dob: "${valid_date}"
                                              gender: "${gender}"
                                              country: "${country}"
                                              address: "${address}"
                                              phone: "${phone}"
                                              email: "${email}"
                                              acceptLegalConsent: ${consent}
                                          ) { 
                                                  success
                                                  message
                                                  data
                                              }
                                      }
                                      `
          }),
          success: function(result) {
              if(!result.data.createPatient.success) {
                  $(".button-plain-icon .heading-5-alt").text("Add patient")
                  errorMessage.css("display", "block")
                  errorMessage.css("background", "#c62828")
                  errorMessage.html(result.data.createPatient.message)
                  errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
                  errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
                  setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
              } else {
                $(".button-plain-icon .heading-5-alt").text("Add patient")
                  errorMessage.css("display", "block")
                  errorMessage.css("background", "#43a047")
                  errorMessage.html(result.data.createPatient.message)
                  errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
                  errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
                  setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
                  pat_arr.push(result.data.createPatient.data.fullName)
                  $(".div-block-48").append(
                    $.map( pat_arr, function( data ) { return `<div class="div-block-49"><div class="div-block-50"><h4>${data}</h4><h5 class="heading-5-alt print_fname"></h5></div></div>`})
                )
              }
              console.log(JSON.stringify(result.data))
          },
          error: function(err) { 
              console.log(err)
          } 
      })

    
})



})