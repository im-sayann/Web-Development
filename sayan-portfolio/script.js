console.log('Working');



// Select the menu icon and navbar elements
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

// Select all the sections and navigation links in the navbar
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav ul li a');

// When the window is scrolled
window.onscroll = () => {
    // Loop through each section
    sections.forEach(sec => {
        // Get the current scroll position
        let top = window.scrollY;
        // Get the offset of the section from the top of the page
        let offset = sec.offsetTop - 150;
        // Get the height of the section
        let height = sec.offsetHeight;
        // Get the id of the section
        let id = sec.getAttribute('id');

        // If the current scroll position is within the section's range
        if(top >= offset && top < offset + height){
            // Loop through each navigation link
            navLinks.forEach(links => {
                // Remove the 'active' class from all links
                links.classList.remove('active');
                // Add the 'active' class to the link corresponding to the current section
                document.querySelector('header nav ul li a[href*=' + id + ' ]').classList.add('active');
            })
        }
    })
}

// When the menu icon is clicked
menuIcon.onclick = ()=>{
    // Log a message to the console
    console.log('Clicked');
    
    // Toggle the 'bx-x' class on the menu icon (for mobile menu icon animation)
    menuIcon.classList.toggle('bx-x')
    // Toggle the 'active' class on the navbar (for mobile menu visibility)
    navbar.classList.toggle('active')
}


menuIcon.addEventListener("click", ()=>{

    console.log('Clicked Menu');
    if (navbar.style.display === "block") {
        navbar.style.display = "none";
    } else {
        navbar.style.display = "block";
    }   
}) 


//  Form code
