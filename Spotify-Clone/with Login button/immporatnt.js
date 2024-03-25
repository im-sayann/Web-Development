



    // Add this JavaScript at the end of your existing JavaScript
    
    // Load the saved user image
    window.onload = function() {
        const savedImage = localStorage.getItem('userImage');
        if (savedImage) {
            document.querySelector('.userImage').innerHTML = `<img src="${savedImage}" alt="User Image">`;
        }
    }


    // Event listener for the save image button
    document.getElementById('saveImageBtn').addEventListener('click', function() {
        const fileInput = document.getElementById('userImageInput');
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageSrc = e.target.result;
                localStorage.setItem('userImage', imageSrc);
                document.querySelector('.userImage').innerHTML = `<img src="${imageSrc}" alt="User Image">`;
            }
            reader.readAsDataURL(file);
        }
        
    });






    // Event listener for the userImageInput change
    document.getElementById('userImageInput').addEventListener('change', function() {
        const fileInput = document.getElementById('userImageInput');
        const file = fileInput.files[0];
        if (file) {
            document.querySelector('.saveImageBtn').style.display = 'block';
            document.querySelector('.userImageInput').style.display.text = 'none'; // Hide the file input
        }
    });

    // Event listener for the saveImageBtn click
    document.getElementById('saveImageBtn').addEventListener('click', function() {
        document.querySelector('.saveImageBtn').style.display = 'none'; // Hide the Save button
    });