const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('photos');
const logoutButton = document.getElementById('logout_button');
const profileButton = document.getElementById('profile_button');
const userName = document.getElementById('user_name');
const userEmail = document.getElementById('user_email');
const searchButton = document.getElementById('search_button');

form.addEventListener('submit',async (event)=>{
  event.preventDefault();

  let formData = new FormData();
  for (let i = 0; i < fileInput.files.length; i++)
  {
    formData.append('photos', fileInput.files[i]);
  }
  formData.append('title', form.title.value);

  const response = await fetch('/upload',{
    method: 'POST',
    body: formData,
  });

  if (response.ok) 
  {
    console.log('Photo(s) uploaded successfully');
    window.location.reload();
    // Perform any necessary actions after successful upload
  } 
  else 
  {
    console.error('Failed to upload photo(s)');
    // Handle error case
  }
});

let photos = [];
// Fetch user's photos and render them in the grid
async function fetchUserPhotos(){
  try {
    const response = await fetch('/api/photos');
    const data = await response.json();
     photos = data.photos;
    const username = data.username;
    const useremail = data.user_email;

    renderPhotoGrid(photos);
    profileButton.textContent = username.charAt(0);
    userName.textContent = username;
    userEmail.textContent = useremail;
      // Add event listener to the search button
    searchButton.addEventListener('click',searchPhotosByTitle);

  }catch(error){
    console.error('Error fetching user photos:', error);
  }
}

// Render the user's photos in the grid
function renderPhotoGrid(photos) {
  const photoGrid = document.getElementById('photo-grid');

  if (!photoGrid) 
  {
    console.error('Photo grid element not found.');
    return;
  }

  photoGrid.innerHTML = ''; // Clear the existing content

  if(photos.length === 0) 
  {
    // Display a message when there are no photos
    const message = document.createElement('p');
    message.textContent = 'No photos to display.';
    photoGrid.appendChild(message);
  }else 
  {
    // Render each photo in the grid
    photos.forEach((photo) =>{
      const photoContainer = document.createElement('div');
      photoContainer.classList.add('photo-container');

      const image = document.createElement('img');
      image.src = photo.imageUrl;
      // image.alt = photo.title;
      photoContainer.appendChild(image);

      const title = document.createElement('p');
      title.textContent = photo.title;
      photoContainer.appendChild(title);

      photoGrid.appendChild(photoContainer);
    });
  }
}
document.addEventListener('DOMContentLoaded', fetchUserPhotos);


// Add click event listener to the logout button
logoutButton.addEventListener('click',()=>{

// Function to use logout
  fetch('/logout',{
    method: 'GET',
    credentials: 'same-origin'
  })
  .then(response => response.json())
  .then(data =>{

     // Replace the current history state with the login page's URL
     window.history.replaceState(null, null, '/index');
     
    // Redirect to the login page
    window.location.href = '/index';
  })
  .catch(error =>{
    console.error('Error logging out:', error);
  });
});

// Function to search photos by title
function searchPhotosByTitle(){
  const searchInput = document.getElementById('search_input');
  const search = searchInput.value.toLowerCase();

  // Filter photos based on the search
  let filteredPhotos = photos.filter((photo) =>
    photo.title.toLowerCase().includes(search)
  );

  renderPhotoGrid(filteredPhotos);
}
