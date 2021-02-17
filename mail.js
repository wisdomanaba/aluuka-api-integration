(function ($) {
"use strict";

    var contact_submit_btn = $("#contact_submit_btn")

    var contactfirstname = $(".contactfirstname").val()

    $("#contact-form").submit(function( event ) {
        contact_submit_btn.html("Goooo..")
        alert("Heyy")
        console.log(contactfirstname)
        event.preventDefault();
    });
    
        
})(jQuery);	