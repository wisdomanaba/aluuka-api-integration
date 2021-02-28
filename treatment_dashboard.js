$(document).ready(function(){

    const token = localStorage.getItem("token")
    const userData = JSON.parse(localStorage.getItem("data"))
    
    var treatment_list;
    
    if(!userData) {
        var loc = `${$(location).attr('origin')}/care-giver/login`
        $(location).attr('href',loc)
    }
    
    const status = { name: "Completed", name: "Pending", name: "Cancelled" }
    
    $(".status_data").html(
        $.map( status, function( status_data ) { return `<a href="/care-giver/treatments-main-dashboard?status=${status_data.name}" class="dropdown-link-3 w-dropdown-link" tabindex="0">${status_data.name}</a>`})
    )
    
    const userfullname = userData.fullName
    var firstName = userfullname.replace(/ .*/, '')
    
    $(".firstname").html(`Welcome, ${firstName}`)
    $(".userfullname").html(`${userfullname}`)
    
    if(userData.pictureURL) {
        $(".prof-img").attr("src", userData.pictureURL)
    }
    
    $(".sign-out").click(function(){
        localStorage.clear()
        var loc = `${$(location).attr('origin')}/care-giver/login`
        $(location).attr('href',loc)
    })

    function getUrlVars(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    var patient_name = getUrlVars()["pat_name"]
    var patient_id = getUrlVars()["pat_id"]

    if(patient_name && patient_id) {
        patient_name = patient_name.replace(/%20/g," ")
        console.log("patient name", patient_name, patient_id)
        $(".patient-name").html(`<span class="text-span-22"></span>${patient_name}`)


        // Get treatent by id

        $.ajax({
            url: "https://aluuka-backend.herokuapp.com",
            contentType: "application/json",
            type:'POST',
            headers: { 'authorization': `Bearer ${JSON.parse(token)}`, 'Access-Control-Allow-Origin': 'https://webflow-conversion-a19937da9b1f54730ca3.webflow.io/' },
            data: JSON.stringify({ query: `query {
                                                listTreatments(
                                                    patientId: "${patient_id}"
                                                    limit: 10
                                                    lastId: ""
                                                ) {
                                                    data {
                                                        id
                                                        patientId
                                                        patient {
                                                            fullName
                                                        }
                                                        healthcareProviderId
                                                        healthcareProvider
                                                        careGiverId
                                                        careGiver
                                                        treatmentItems {
                                                                price
                                                                description
                                                                quantity
                                                                name
                                                        }
                                                        subTotal
                                                        grandTotal
                                                        isPaid
                                                        isAccepted
                                                        isCompleted
                                                        createdAt
                                                        updatedAt
                                                    }
                                                }
                                            }
                                        `
            }),
            success: function(result) {
            
            treatment_list = result.data.listTreatments.data
            
            var specific_treatnent =  treatment_list.filter(function(treatment) {
                return treatment.id == patient_id
            })

            console.log("Here", treatment_list)
            
            // [ {name: “Ironman”, franchise: “Marvel”}, {name: “Thor”, franchise: “Marvel”} ]
            
            if(Array.isArray(specific_treatnent) && !specific_treatnent.length) {
                  //var loc = `${$(location).attr('origin')}/empty-states/empty-state-1`
                //$(location).attr('href',loc)
                
                $(".treatment_list_table").after(`
                    <div class="empty-state-1-body">
                    <div class="empty-state-1-body-elements">
                        <img src="https://uploads-ssl.webflow.com/5fe9d2f67366097441900c56/5fe9d2f67366093bd9900ca7_Group%205302.png" loading="lazy" width="297" alt="" />
                        <div class="emply-state-header">You have no Treatment</div>
                        <div class="empty-state-subheader">Click to add a new Treatment</div>
                        <a href="/care-giver/new-treatment-laboratory" class="button-medium-stretch w-button">Create Treatment</a>
                    </div>
                    </div>
                `)
                
                  return false;
             }
            
            $(".treat_num").html(`${specific_treatnent.length + 1}`)
              
            $(".treatment_list_table").after(
                    $.map( specific_treatnent, function( data ) {
                  
                        const date_treat = new Date(`${data.createdAt}`).toLocaleDateString("en-US",dateoptions)
                        console.log("Treat date",date_treat)

                        var feenum = data.grandTotal - data.subTotal;
                        var nfee = feenum.toFixed(2);


                        return  data.isCompleted ? `<div class="treatments-dashboard-table-row-5">
                                                        <div class="treatments-dashboard-table-row-5-block-1">
                                                            <div class="treatments-dashboard-table-row-5-label">
                                                                <a href="/care-giver/view-treatment?treatment_id=${data.id}&hcp_id=${data.healthcareProviderId}">${data.patient.fullName}</a>
                                                            </div>
                                                        </div>
                                                        <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714355c-f6900c70" class="treatments-dashboard-table-row-5-block-2">
                                                            <div class="treatments-dashboard-table-row-5-label">Pending</div>
                                                        </div>
                                                        <div class="treatments-dashboard-table-row-5-block-3">
                                                            <div class="treatments-dashboard-table-row-5-label">${data.healthcareProvider}</div>
                                                        </div>
                                                        <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143562-f6900c70" class="treatments-dashboard-table-row-5-block-4">
                                                            <div data-hover="" data-delay="20" class="w-dropdown">
                                                                <div class="dropdown-toggle-4 w-dropdown-toggle" key="${data.id}" id="w-dropdown-toggle-10" aria-controls="w-dropdown-list-10" aria-haspopup="menu" aria-expanded="false" role="button" tabindex="0">
                                                                    <div class="icon-27 w-icon-dropdown-toggle"></div>
                                                                    <div>View</div>
                                                                </div>
                                                                <nav class="dropdown-list-3 w-dropdown-list ${data.id}-show" id="w-dropdown-list-10" aria-labelledby="w-dropdown-toggle-10">
                                                                    <div class="div-block-143">
                                                                        <a href="#" class="table-dropdown-link-3 w-dropdown-link" tabindex="0">Treatment</a>
                                                                        <div class="table-dropdown-link-3-sub">$1400</div>
                                                                    </div>
                                                                    ${$.map( data.treatmentItems, function( treat_data ) { 
                                                                        `<div class="div-block-143">
                                                                            <a href="#" class="table-dropdown-link-3-plain w-dropdown-link" tabindex="0">${treat_data.name}</a>
                                                                            <div class="table-dropdown-link-3-plain-sub">$${treat_data.price}.00</div>
                                                                        </div>
                                                                        `
                                                                    })}
                                                                </nav>
                                                            </div>
                                                        </div>
                                                        <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714356f-f6900c70" class="treatments-dashboard-table-row-5-block-5">
                                                            <div class="treatments-dashboard-table-row-5-label">$${nfee}</div>
                                                        </div>
                                                        <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143572-f6900c70" class="treatments-dashboard-table-row-3-block-6">
                                                            <a href="#" class="treatments-dashboard-table-row-5-button w-button">COMPLETED</a>
                                                        </div>
                                                    </div>`
                        :  data.isPaid ? `<div class="treatments-dashboard-table-row-5">
                                            <div class="treatments-dashboard-table-row-5-block-1">
                                                <div class="treatments-dashboard-table-row-5-label">
                                                    <a href="/care-giver/view-treatment?treatment_id=${data.id}&hcp_id=${data.healthcareProviderId}">${data.patient.fullName}</a>
                                                </div>
                                            </div>
                                            <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714355c-f6900c70" class="treatments-dashboard-table-row-5-block-2">
                                                <div class="treatments-dashboard-table-row-5-label">Pending</div>
                                            </div>
                                            <div class="treatments-dashboard-table-row-5-block-3">
                                                <div class="treatments-dashboard-table-row-5-label">${data.healthcareProvider}</div>
                                            </div>
                                            <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143562-f6900c70" class="treatments-dashboard-table-row-5-block-4">
                                                <div data-hover="" data-delay="20" class="w-dropdown">
                                                    <div class="dropdown-toggle-4 w-dropdown-toggle" key="${data.id}" id="w-dropdown-toggle-10" aria-controls="w-dropdown-list-10" aria-haspopup="menu" aria-expanded="false" role="button" tabindex="0">
                                                        <div class="icon-27 w-icon-dropdown-toggle"></div>
                                                        <div>View</div>
                                                    </div>
                                                    <nav class="dropdown-list-3 w-dropdown-list ${data.id}-show" id="w-dropdown-list-10" aria-labelledby="w-dropdown-toggle-10">
                                                        <div class="div-block-143">
                                                            <a href="#" class="table-dropdown-link-3 w-dropdown-link" tabindex="0">Treatment</a>
                                                            <div class="table-dropdown-link-3-sub">$1400</div>
                                                        </div>
                                                        ${$.map( data.treatmentItems, function( treat_data ) { 
                                                            `<div class="div-block-143">
                                                                <a href="#" class="table-dropdown-link-3-plain w-dropdown-link" tabindex="0">${treat_data.name}</a>
                                                                <div class="table-dropdown-link-3-plain-sub">$${treat_data.price}.00</div>
                                                            </div>
                                                            `
                                                        })}
                                                    </nav>
                                                </div>
                                            </div>
                                            <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714356f-f6900c70" class="treatments-dashboard-table-row-5-block-5">
                                                <div class="treatments-dashboard-table-row-5-label">$${nfee}</div>
                                            </div>
                                            <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143572-f6900c70" class="treatments-dashboard-table-row-3-block-6">
                                                <a href="#" class="treatments-dashboard-table-row-3-button w-button">PAID</a>
                                            </div>
                                        </div>`
                        :  data.isAccepted ? `<div class="treatments-dashboard-table-row-5">
                                                <div class="treatments-dashboard-table-row-5-block-1">
                                                    <div class="treatments-dashboard-table-row-5-label">
                                                        <a href="/care-giver/treatment-details-payment?treatment_id=${data.id}&hcp_id=${data.healthcareProviderId}">${data.patient.fullName}</a>
                                                    </div>
                                                </div>
                                                <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714355c-f6900c70" class="treatments-dashboard-table-row-5-block-2">
                                                    <div class="treatments-dashboard-table-row-5-label">Pending</div>
                                                </div>
                                                <div class="treatments-dashboard-table-row-5-block-3">
                                                    <div class="treatments-dashboard-table-row-5-label">${data.healthcareProvider}</div>
                                                </div>
                                                <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143562-f6900c70" class="treatments-dashboard-table-row-5-block-4">
                                                    <div data-hover="" data-delay="20" class="w-dropdown">
                                                        <div class="dropdown-toggle-4 w-dropdown-toggle" key="${data.id}" id="w-dropdown-toggle-10" aria-controls="w-dropdown-list-10" aria-haspopup="menu" aria-expanded="false" role="button" tabindex="0">
                                                            <div class="icon-27 w-icon-dropdown-toggle"></div>
                                                            <div>View</div>
                                                        </div>
                                                        <nav class="dropdown-list-3 w-dropdown-list ${data.id}-show" id="w-dropdown-list-10" aria-labelledby="w-dropdown-toggle-10">
                                                            <div class="div-block-143">
                                                                <a href="#" class="table-dropdown-link-3 w-dropdown-link" tabindex="0">Treatment</a>
                                                                <div class="table-dropdown-link-3-sub">$1400</div>
                                                            </div>
                                                            ${$.map( data.treatmentItems, function( treat_data ) { 
                                                                `<div class="div-block-143">
                                                                    <a href="#" class="table-dropdown-link-3-plain w-dropdown-link" tabindex="0">${treat_data.name}</a>
                                                                    <div class="table-dropdown-link-3-plain-sub">$${treat_data.price}.00</div>
                                                                </div>
                                                                `
                                                            })}
                                                        </nav>
                                                    </div>
                                                </div>
                                                <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714356f-f6900c70" class="treatments-dashboard-table-row-5-block-5">
                                                    <div class="treatments-dashboard-table-row-5-label">$${nfee}</div>
                                                </div>
                                                <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143572-f6900c70" class="treatments-dashboard-table-row-3-block-6">
                                                    <a href="#" class="treatments-dashboard-table-row-3-button w-button">ACCEPTED</a>
                                                </div>
                                            </div>`
                        :  `<div class="treatments-dashboard-table-row-5">
                                <div class="treatments-dashboard-table-row-5-block-1">
                                    <div class="treatments-dashboard-table-row-5-label">
                                        <a href="/care-giver/treatment-details-payment?treatment_id=${data.id}&hcp_id=${data.healthcareProviderId}">${data.patient.fullName}</a>
                                    </div>
                                </div>
                                <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714355c-f6900c70" class="treatments-dashboard-table-row-5-block-2">
                                    <div class="treatments-dashboard-table-row-5-label">Pending</div>
                                </div>
                                <div class="treatments-dashboard-table-row-5-block-3">
                                    <div class="treatments-dashboard-table-row-5-label">${data.healthcareProvider}</div>
                                </div>
                                <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143562-f6900c70" class="treatments-dashboard-table-row-5-block-4">
                                    <div data-hover="" data-delay="20" class="w-dropdown">
                                        <div class="dropdown-toggle-4 w-dropdown-toggle" key="${data.id}" id="w-dropdown-toggle-10" aria-controls="w-dropdown-list-10" aria-haspopup="menu" aria-expanded="false" role="button" tabindex="0">
                                            <div class="icon-27 w-icon-dropdown-toggle"></div>
                                            <div>View</div>
                                        </div>
                                        <nav class="dropdown-list-3 w-dropdown-list ${data.id}-show" id="w-dropdown-list-10" aria-labelledby="w-dropdown-toggle-10">
                                            <div class="div-block-143">
                                                <a href="#" class="table-dropdown-link-3 w-dropdown-link" tabindex="0">Treatment</a>
                                                <div class="table-dropdown-link-3-sub">$1400</div>
                                            </div>
                                            ${$.map( data.treatmentItems, function( treat_data ) { 
                                                `<div class="div-block-143">
                                                    <a href="#" class="table-dropdown-link-3-plain w-dropdown-link" tabindex="0">${treat_data.name}</a>
                                                    <div class="table-dropdown-link-3-plain-sub">$${treat_data.price}.00</div>
                                                </div>
                                                `
                                            })}
                                        </nav>
                                    </div>
                                </div>
                                <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714356f-f6900c70" class="treatments-dashboard-table-row-5-block-5">
                                    <div class="treatments-dashboard-table-row-5-label">$${nfee}</div>
                                </div>
                                <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143572-f6900c70" class="treatments-dashboard-table-row-3-block-6">
                                    <a href="#" class="treatments-dashboard-table-row-4-button w-button">PENDING</a>
                                </div>
                            </div>`
              
                    })
                )
                $('.w-dropdown').on('click', '.dropdown-toggle-4', function () {
                    var className = $(this).attr("class");   
                    var keyName = $(this).attr("key");
                    alert(`${className} ${keyName}`);
                    $(`${keyName}-show`).addClass("w--open")
                });
                console.log(JSON.stringify(specific_treatnent))
            },
            error: function(err) { 
                console.log(err)
            } 
        })

    }
    


    // List patients for filter

    $.ajax({
        url: "https://aluuka-backend.herokuapp.com",
        contentType: "application/json",
        type:'POST',
        headers: { 'authorization': `Bearer ${JSON.parse(token)}` },
        data: JSON.stringify({ query: `query {
                                    listPatients(
                                    lastId: ""
                                    limit: 100
                                    ) {
                                    data {
                                        id
                                        fullName
                                        gender
                                        country
                                        address
                                        phone
                                        email
                                        dob
                                    }
                                    }
                                }
                                `
        }),
        success: function(result) {

            const patient_list = result.data.listPatients.data

            if(Array.isArray(patient_list) && !patient_list.length) {
                $(".patient-name-filter").append(`<a href="/care-giver/add-patient-profile" class="dropdown-link-3 w-dropdown-link" tabindex="0">Add Patient</a>`)
                return false;
            }

            $(".patient-name-filter").append(
                $.map( patient_list, function( data ) { return `<a href="/care-giver/treatments-main-dashboard?pat_id=${data.id}&pat_name=${data.fullName}" class="dropdown-link-3 w-dropdown-link" tabindex="0">${data.fullName}</a>`})
            )

            console.log(JSON.stringify(patient_list))
            
        },
        error: function(err) { 
            console.log(err)
        } 
    })

    // End List patients for filter
    
    
    const dateoptions = {
         year: "2-digit",
         month:"2-digit",
         day:"2-digit"
    }
    
    // output  "12/08/18"
    
    // Treatment List
        $.ajax({
            url: "https://aluuka-backend.herokuapp.com",
            contentType: "application/json",
            type:'POST',
            headers: { 'authorization': `Bearer ${JSON.parse(token)}`, 'Access-Control-Allow-Origin': 'https://webflow-conversion-a19937da9b1f54730ca3.webflow.io/' },
            data: JSON.stringify({ query: `query {
                                                listTreatments(
                                                    patientId: ""
                                                    limit: 10
                                                    lastId: ""
                                                ) {
                                                    data {
                                                        id
                                                        patientId
                                                        patient {
                                                            fullName
                                                        }
                                                        healthcareProviderId
                                                        healthcareProvider
                                                        careGiverId
                                                        careGiver
                                                        treatmentItems {
                                                                price
                                                                description
                                                                quantity
                                                                name
                                                        }
                                                        subTotal
                                                        grandTotal
                                                        isPaid
                                                        isAccepted
                                                        isCompleted
                                                        createdAt
                                                        updatedAt
                                                    }
                                                }
                                            }
                                        `
            }),
            success: function(result) {
            
            treatment_list = result.data.listTreatments.data
            
            console.log("Here", treatment_list)
            
            if(Array.isArray(treatment_list) && !treatment_list.length) {
                  //var loc = `${$(location).attr('origin')}/empty-states/empty-state-1`
                //$(location).attr('href',loc)
                
                $(".treatment_list_table").after(`
                    <div class="empty-state-1-body">
                    <div class="empty-state-1-body-elements">
                        <img src="https://uploads-ssl.webflow.com/5fe9d2f67366097441900c56/5fe9d2f67366093bd9900ca7_Group%205302.png" loading="lazy" width="297" alt="" />
                        <div class="emply-state-header">You have no Treatment</div>
                        <div class="empty-state-subheader">Click to add a new Treatment</div>
                        <a href="/care-giver/new-treatment-laboratory" class="button-medium-stretch w-button">Create Treatment</a>
                    </div>
                    </div>
                `)
                
                  return false;
             }
            
            $(".treat_num").html(`${treatment_list.length + 1}`)
              
            $(".treatment_list_table").after(
                    $.map( treatment_list, function( data ) {
                  
                        const date_treat = new Date(`${data.createdAt}`).toLocaleDateString("en-US",dateoptions)
                        console.log("Treat date",date_treat)

                        var feenum = data.grandTotal - data.subTotal;
                        var nfee = feenum.toFixed(2);


                        return  data.isCompleted ? `<div class="treatments-dashboard-table-row-5">
                                                        <div class="treatments-dashboard-table-row-5-block-1">
                                                            <div class="treatments-dashboard-table-row-5-label">
                                                                <a href="/care-giver/view-treatment?treatment_id=${data.id}&hcp_id=${data.healthcareProviderId}">${data.patient.fullName}</a>
                                                            </div>
                                                        </div>
                                                        <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714355c-f6900c70" class="treatments-dashboard-table-row-5-block-2">
                                                            <div class="treatments-dashboard-table-row-5-label">Pending</div>
                                                        </div>
                                                        <div class="treatments-dashboard-table-row-5-block-3">
                                                            <div class="treatments-dashboard-table-row-5-label">${data.healthcareProvider}</div>
                                                        </div>
                                                        <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143562-f6900c70" class="treatments-dashboard-table-row-5-block-4">
                                                            <div data-hover="" data-delay="20" class="w-dropdown">
                                                                <div class="dropdown-toggle-4 w-dropdown-toggle" key="${data.id}" id="w-dropdown-toggle-10" aria-controls="w-dropdown-list-10" aria-haspopup="menu" aria-expanded="false" role="button" tabindex="0">
                                                                    <div class="icon-27 w-icon-dropdown-toggle"></div>
                                                                    <div>View</div>
                                                                </div>
                                                                <nav class="dropdown-list-3 w-dropdown-list ${data.id}-show" id="w-dropdown-list-10" aria-labelledby="w-dropdown-toggle-10">
                                                                    <div class="div-block-143">
                                                                        <a href="#" class="table-dropdown-link-3 w-dropdown-link" tabindex="0">Treatment</a>
                                                                        <div class="table-dropdown-link-3-sub">$1400</div>
                                                                    </div>
                                                                    ${$.map( data.treatmentItems, function( treat_data ) { 
                                                                        `<div class="div-block-143">
                                                                            <a href="#" class="table-dropdown-link-3-plain w-dropdown-link" tabindex="0">${treat_data.name}</a>
                                                                            <div class="table-dropdown-link-3-plain-sub">$${treat_data.price}.00</div>
                                                                        </div>
                                                                        `
                                                                    })}
                                                                </nav>
                                                            </div>
                                                        </div>
                                                        <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714356f-f6900c70" class="treatments-dashboard-table-row-5-block-5">
                                                            <div class="treatments-dashboard-table-row-5-label">$${nfee}</div>
                                                        </div>
                                                        <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143572-f6900c70" class="treatments-dashboard-table-row-3-block-6">
                                                            <a href="#" class="treatments-dashboard-table-row-5-button w-button">COMPLETED</a>
                                                        </div>
                                                    </div>`
                        :  data.isPaid ? `<div class="treatments-dashboard-table-row-5">
                                            <div class="treatments-dashboard-table-row-5-block-1">
                                                <div class="treatments-dashboard-table-row-5-label">
                                                    <a href="/care-giver/view-treatment?treatment_id=${data.id}&hcp_id=${data.healthcareProviderId}">${data.patient.fullName}</a>
                                                </div>
                                            </div>
                                            <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714355c-f6900c70" class="treatments-dashboard-table-row-5-block-2">
                                                <div class="treatments-dashboard-table-row-5-label">Pending</div>
                                            </div>
                                            <div class="treatments-dashboard-table-row-5-block-3">
                                                <div class="treatments-dashboard-table-row-5-label">${data.healthcareProvider}</div>
                                            </div>
                                            <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143562-f6900c70" class="treatments-dashboard-table-row-5-block-4">
                                                <div data-hover="" data-delay="20" class="w-dropdown">
                                                    <div class="dropdown-toggle-4 w-dropdown-toggle" key="${data.id}" id="w-dropdown-toggle-10" aria-controls="w-dropdown-list-10" aria-haspopup="menu" aria-expanded="false" role="button" tabindex="0">
                                                        <div class="icon-27 w-icon-dropdown-toggle"></div>
                                                        <div>View</div>
                                                    </div>
                                                    <nav class="dropdown-list-3 w-dropdown-list ${data.id}-show" id="w-dropdown-list-10" aria-labelledby="w-dropdown-toggle-10">
                                                        <div class="div-block-143">
                                                            <a href="#" class="table-dropdown-link-3 w-dropdown-link" tabindex="0">Treatment</a>
                                                            <div class="table-dropdown-link-3-sub">$1400</div>
                                                        </div>
                                                        ${$.map( data.treatmentItems, function( treat_data ) { 
                                                            `<div class="div-block-143">
                                                                <a href="#" class="table-dropdown-link-3-plain w-dropdown-link" tabindex="0">${treat_data.name}</a>
                                                                <div class="table-dropdown-link-3-plain-sub">$${treat_data.price}.00</div>
                                                            </div>
                                                            `
                                                        })}
                                                    </nav>
                                                </div>
                                            </div>
                                            <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714356f-f6900c70" class="treatments-dashboard-table-row-5-block-5">
                                                <div class="treatments-dashboard-table-row-5-label">$${nfee}</div>
                                            </div>
                                            <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143572-f6900c70" class="treatments-dashboard-table-row-3-block-6">
                                                <a href="#" class="treatments-dashboard-table-row-3-button w-button">PAID</a>
                                            </div>
                                        </div>`
                        :  data.isAccepted ? `<div class="treatments-dashboard-table-row-5">
                                                <div class="treatments-dashboard-table-row-5-block-1">
                                                    <div class="treatments-dashboard-table-row-5-label">
                                                        <a href="/care-giver/treatment-details-payment?treatment_id=${data.id}&hcp_id=${data.healthcareProviderId}">${data.patient.fullName}</a>
                                                    </div>
                                                </div>
                                                <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714355c-f6900c70" class="treatments-dashboard-table-row-5-block-2">
                                                    <div class="treatments-dashboard-table-row-5-label">Pending</div>
                                                </div>
                                                <div class="treatments-dashboard-table-row-5-block-3">
                                                    <div class="treatments-dashboard-table-row-5-label">${data.healthcareProvider}</div>
                                                </div>
                                                <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143562-f6900c70" class="treatments-dashboard-table-row-5-block-4">
                                                    <div data-hover="" data-delay="20" class="w-dropdown">
                                                        <div class="dropdown-toggle-4 w-dropdown-toggle" key="${data.id}" id="w-dropdown-toggle-10" aria-controls="w-dropdown-list-10" aria-haspopup="menu" aria-expanded="false" role="button" tabindex="0">
                                                            <div class="icon-27 w-icon-dropdown-toggle"></div>
                                                            <div>View</div>
                                                        </div>
                                                        <nav class="dropdown-list-3 w-dropdown-list ${data.id}-show" id="w-dropdown-list-10" aria-labelledby="w-dropdown-toggle-10">
                                                            <div class="div-block-143">
                                                                <a href="#" class="table-dropdown-link-3 w-dropdown-link" tabindex="0">Treatment</a>
                                                                <div class="table-dropdown-link-3-sub">$1400</div>
                                                            </div>
                                                            ${$.map( data.treatmentItems, function( treat_data ) { 
                                                                `<div class="div-block-143">
                                                                    <a href="#" class="table-dropdown-link-3-plain w-dropdown-link" tabindex="0">${treat_data.name}</a>
                                                                    <div class="table-dropdown-link-3-plain-sub">$${treat_data.price}.00</div>
                                                                </div>
                                                                `
                                                            })}
                                                        </nav>
                                                    </div>
                                                </div>
                                                <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714356f-f6900c70" class="treatments-dashboard-table-row-5-block-5">
                                                    <div class="treatments-dashboard-table-row-5-label">$${nfee}</div>
                                                </div>
                                                <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143572-f6900c70" class="treatments-dashboard-table-row-3-block-6">
                                                    <a href="#" class="treatments-dashboard-table-row-3-button w-button">ACCEPTED</a>
                                                </div>
                                            </div>`
                        :  `<div class="treatments-dashboard-table-row-5">
                                <div class="treatments-dashboard-table-row-5-block-1">
                                    <div class="treatments-dashboard-table-row-5-label">
                                        <a href="/care-giver/treatment-details-payment?treatment_id=${data.id}&hcp_id=${data.healthcareProviderId}">${data.patient.fullName}</a>
                                    </div>
                                </div>
                                <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714355c-f6900c70" class="treatments-dashboard-table-row-5-block-2">
                                    <div class="treatments-dashboard-table-row-5-label">Pending</div>
                                </div>
                                <div class="treatments-dashboard-table-row-5-block-3">
                                    <div class="treatments-dashboard-table-row-5-label">${data.healthcareProvider}</div>
                                </div>
                                <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143562-f6900c70" class="treatments-dashboard-table-row-5-block-4">
                                    <div data-hover="" data-delay="20" class="w-dropdown">
                                        <div class="dropdown-toggle-4 w-dropdown-toggle" key="${data.id}" id="w-dropdown-toggle-10" aria-controls="w-dropdown-list-10" aria-haspopup="menu" aria-expanded="false" role="button" tabindex="0">
                                            <div class="icon-27 w-icon-dropdown-toggle"></div>
                                            <div>View</div>
                                        </div>
                                        <nav class="dropdown-list-3 w-dropdown-list ${data.id}-show" id="w-dropdown-list-10" aria-labelledby="w-dropdown-toggle-10">
                                            <div class="div-block-143">
                                                <a href="#" class="table-dropdown-link-3 w-dropdown-link" tabindex="0">Treatment</a>
                                                <div class="table-dropdown-link-3-sub">$1400</div>
                                            </div>
                                            ${$.map( data.treatmentItems, function( treat_data ) { 
                                                `<div class="div-block-143">
                                                    <a href="#" class="table-dropdown-link-3-plain w-dropdown-link" tabindex="0">${treat_data.name}</a>
                                                    <div class="table-dropdown-link-3-plain-sub">$${treat_data.price}.00</div>
                                                </div>
                                                `
                                            })}
                                        </nav>
                                    </div>
                                </div>
                                <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714356f-f6900c70" class="treatments-dashboard-table-row-5-block-5">
                                    <div class="treatments-dashboard-table-row-5-label">$${nfee}</div>
                                </div>
                                <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143572-f6900c70" class="treatments-dashboard-table-row-3-block-6">
                                    <a href="#" class="treatments-dashboard-table-row-4-button w-button">PENDING</a>
                                </div>
                            </div>`
              
                    })
                )
                $('.w-dropdown').on('click', '.dropdown-toggle-4', function () {
                    var className = $(this).attr("class");   
                    var keyName = $(this).attr("key");
                    alert(`${className} ${keyName}`);
                    $(`${keyName}-show`).addClass("w--open")
                });
                console.log(JSON.stringify(treatment_list))
            },
            error: function(err) { 
                console.log(err)
            } 
        })
    
})