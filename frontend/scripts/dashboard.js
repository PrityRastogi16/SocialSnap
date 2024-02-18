// // Elements
// const toggleThemeBtn = document.querySelector('.header__theme-button');
// const storiesContent = document.querySelector('.stories__content');
// const storiesLeftButton = document.querySelector('.stories__left-button');
// const storiesRightButton = document.querySelector('.stories__right-button');
// const posts = document.querySelectorAll('.post');
// const postsContent = document.querySelectorAll('.post__content');

// // ===================================
// // DARK/LIGHT THEME
// // Set initial theme from LocalStorage
// document.onload = setInitialTheme(localStorage.getItem('theme'));
// function setInitialTheme(themeKey) {
//   if (themeKey === 'dark') {
//     document.documentElement.classList.add('darkTheme');
//   } else {
//     document.documentElement.classList.remove('darkTheme');
//   }
// }

// // Toggle theme button
// // toggleThemeBtn.addEventListener('click', () => {
// //   // Toggle root class
// //   document.documentElement.classList.toggle('darkTheme');

// //   // Saving current theme on LocalStorage
// //   if (document.documentElement.classList.contains('darkTheme')) {
// //     localStorage.setItem('theme', 'dark');
// //   } else {
// //     localStorage.setItem('theme', 'light');
// //   }
// // });

// // ===================================
// // STORIES SCROLL BUTTONS
// // Scrolling stories content
// storiesLeftButton.addEventListener('click', () => {
//   storiesContent.scrollLeft -= 320;
// });
// storiesRightButton.addEventListener('click', () => {
//   storiesContent.scrollLeft += 320;
// });

// // Checking if screen has minimun size of 1024px
// if (window.matchMedia('(min-width: 1024px)').matches) {
//   // Observer to hide buttons when necessary
//   const storiesObserver = new IntersectionObserver(
//     function (entries) {
//       entries.forEach((entry) => {
//         if (entry.target === document.querySelector('.story:first-child')) {
//           storiesLeftButton.style.display = entry.isIntersecting
//             ? 'none'
//             : 'unset';
//         } else if (
//           entry.target === document.querySelector('.story:last-child')
//         ) {
//           storiesRightButton.style.display = entry.isIntersecting
//             ? 'none'
//             : 'unset';
//         }
//       });
//     },
//     { root: storiesContent, threshold: 1 }
//   );

//   // Calling the observer with the first and last stories
//   storiesObserver.observe(document.querySelector('.story:first-child'));
//   storiesObserver.observe(document.querySelector('.story:last-child'));
// }

// // ===================================
// // POST MULTIPLE MEDIAS
// // Creating scroll buttons and indicators when post has more than one media
// posts.forEach((post) => {
//   if (post.querySelectorAll('.post__media').length > 1) {
//     const leftButtonElement = document.createElement('button');
//     leftButtonElement.classList.add('post__left-button');
//     leftButtonElement.innerHTML = `
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//         <path fill="#fff" d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zM142.1 273l135.5 135.5c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L226.9 256l101.6-101.6c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L142.1 239c-9.4 9.4-9.4 24.6 0 34z"></path>
//       </svg>
//     `;

//     const rightButtonElement = document.createElement('button');
//     rightButtonElement.classList.add('post__right-button');
//     rightButtonElement.innerHTML = `
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//         <path fill="#fff" d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm113.9 231L234.4 103.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L285.1 256 183.5 357.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L369.9 273c9.4-9.4 9.4-24.6 0-34z"></path>
//       </svg>
//     `;

//     post.querySelector('.post__content').appendChild(leftButtonElement);
//     post.querySelector('.post__content').appendChild(rightButtonElement);

//     post.querySelectorAll('.post__media').forEach(function () {
//       const postMediaIndicatorElement = document.createElement('div');
//       postMediaIndicatorElement.classList.add('post__indicator');

//       post
//         .querySelector('.post__indicators')
//         .appendChild(postMediaIndicatorElement);
//     });

//     // Observer to change the actual media indicator
//     const postMediasContainer = post.querySelector('.post__medias');
//     const postMediaIndicators = post.querySelectorAll('.post__indicator');
//     const postIndicatorObserver = new IntersectionObserver(
//       function (entries) {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             // Removing all the indicators
//             postMediaIndicators.forEach((indicator) =>
//               indicator.classList.remove('post__indicator--active')
//             );
//             // Adding the indicator that matches the current post media
//             postMediaIndicators[
//               Array.from(postMedias).indexOf(entry.target)
//             ].classList.add('post__indicator--active');
//           }
//         });
//       },
//       { root: postMediasContainer, threshold: 0.5 }
//     );

//     // Calling the observer for every post media
//     const postMedias = post.querySelectorAll('.post__media');
//     postMedias.forEach((media) => {
//       postIndicatorObserver.observe(media);
//     });
//   }
// });

// // Adding buttons features on every post with multiple medias
// postsContent.forEach((post) => {
//   if (post.querySelectorAll('.post__media').length > 1) {
//     const leftButton = post.querySelector('.post__left-button');
//     const rightButton = post.querySelector('.post__right-button');
//     const postMediasContainer = post.querySelector('.post__medias');

//     // Functions for left and right buttons
//     leftButton.addEventListener('click', () => {
//       postMediasContainer.scrollLeft -= 400;
//     });
//     rightButton.addEventListener('click', () => {
//       postMediasContainer.scrollLeft += 400;
//     });

//     // Observer to hide button if necessary
//     const postButtonObserver = new IntersectionObserver(
//       function (entries) {
//         entries.forEach((entry) => {
//           if (entry.target === post.querySelector('.post__media:first-child')) {
//             leftButton.style.display = entry.isIntersecting ? 'none' : 'unset';
//           } else if (
//             entry.target === post.querySelector('.post__media:last-child')
//           ) {
//             rightButton.style.display = entry.isIntersecting ? 'none' : 'unset';
//           }
//         });
//       },
//       { root: postMediasContainer, threshold: 0.5 }
//     );

//     if (window.matchMedia('(min-width: 1024px)').matches) {
//       postButtonObserver.observe(
//         post.querySelector('.post__media:first-child')
//       );
//       postButtonObserver.observe(post.querySelector('.post__media:last-child'));
//     }
//   }
// });


const createPostButton = document.getElementById('createPostButton');
const createPostButtonInMobile = document.getElementById("createPostButtonInMobile")

const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');

createPostButton.addEventListener('click', (e) => {
    e.preventDefault()
    console.log("Hello")
  overlay.style.display = 'block';
  modal.style.display = 'block';
});
createPostButtonInMobile.addEventListener('click', (e) => {
  e.preventDefault()
  console.log("Hello")
overlay.style.display = 'block';
modal.style.display = 'block';
});

overlay.addEventListener('click', (e) => {
    e.preventDefault()
  overlay.style.display = 'none';
  modal.style.display = 'none';
});
document.addEventListener("change", function(event){
  if (event.target && event.target.id === "fileInput") {
    const files = event.target.files;
    const previewContainer = document.getElementById("previewContainer");
    previewContainer.innerHTML = ""; // Clear previous previews

  for (const file of files) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function(event) {
      const fileType = file.type.startsWith("image") ? "image" : "video";
      const previewElement = document.createElement(fileType);
      previewElement.src = event.target.result;
      previewElement.alt = file.name;
      previewElement.classList.add("preview");
      previewContainer.appendChild(previewElement);
    };
  }
}
});

const userID = "65ce36215ad37ed65b0c0988";

// Create POST 
// const form = document.getElementById("postForm")
// form.addEventListener("submit",(e)=>{
//   e.preventDefault();
// })
document.getElementById("postBtn").addEventListener("click", async function(event) {
  event.preventDefault();
  
  const formData = new FormData();
  formData.append("files", document.getElementById("fileInput").files[0]);
  formData.append("description", document.getElementById("description").value);
  
  try {
    const response = await fetch(`http://localhost:6420/posts/create_post/${userID}`, {
      method: "POST",
      headers: {"enctype": "multipart/form-data", 
      Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NWNlMzYyMTVhZDM3ZWQ2NWIwYzA5ODgiLCJ1c2VybmFtZSI6IkhhcnNoYSIsImlhdCI6MTcwODAxMzE3NywiZXhwIjoxNzA4NjE3OTc3fQ.T-aAxinT1u_0VLoTqW3kdLLB9DPDV7-vA5q7e67VnZI"
    },
      body: formData
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(data.msg);
      // Do something after post creation, like showing a success message or redirecting to another page
      alert("Post created")
    } else {
      console.error("Failed to create post");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});


// GET POST:
// Fetch posts data from backend
fetch('http://localhost:6420/posts/all_post')
  .then(response => response.json())
  .then(data => {
    // Assuming 'data' is an array of post objects
    console.log(data);
    const postsContainer = document.querySelector('.posts');

    // Iterate over each post
    data.forEach(post => {
      fetch(`http://localhost:6420/users/${post.user_id}`)
      // Create post element
      .then(response => response.json())
      .then(userData => {
        // Assuming userData contains user details like name
        const userName = userData.name;

        // Create post element
        const postElement = document.createElement('article');
        postElement.classList.add('post');

        // Construct post HTML dynamically
        postElement.innerHTML = `
          <div class="post__header">
            <div class="post__profile">
              <a href="${userData.imageURL || '#'}" target="_blank" class="post__avatar">
                <img src="${userData.imageURL || '../images/default-user.png'}" alt="User Picture" />
              </a>
              <a href="${userData.photoURL || '#'}" target="_blank" class="post__user">${userName}</a>
            </div>
            <!-- Add other elements dynamically -->
          </div>
          <div class="post__content">
            <div class="post__medias">
              <img class="post__media" src="${post.media[0].imageURL || '../images/insta-clone.png'}" alt="Post Content" />
            </div>
          </div>
          <div class="post__footer">
            <!-- Add footer elements dynamically -->
          </div>
        `;

        // Append post element to container
        postsContainer.appendChild(postElement);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
        alert("ERROR")
      });
  });
})
.catch(error => {
  console.error('Error fetching posts:', error);
  alert("ERROR")
});