/* Profile Page JavaScript */

"use strict";

// Check if user is logged in on page load
window.onload = function () {
    const loginData = JSON.parse(localStorage.getItem('login-data'));
    if (!loginData || !loginData.token) {
        // Redirect to login page if not logged in
        window.location.href = '/index.html';
        return;
    }

    fetchUserPosts(loginData.username); // Fetch user posts for the logged-in user
    fetchUserData(loginData.username);
};

document.getElementById('logoutButton').addEventListener('click', function () {
    logout();
});
document.getElementById('postForm').addEventListener('submit', submitPost);



function submitPost(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the post content from the textarea
    const postContent = document.getElementById('postContent').value.trim();

    if (postContent === '') {
        alert('Please enter some content for your post.');
        return;
    }

    // Call function to create post
    createPost(postContent);
}

//creates posts
function createPost(content) {
     // Assuming you have stored login data in localStorage
     const loginData = JSON.parse(localStorage.getItem('login-data'));
    const postData = {
        text: content,
    };


    fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts', {
        method: "POST",
        body: JSON.stringify(postData),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginData.token}`,
        },

    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create post.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Post created successfully:', data);
            alert('Post created successfully!');

            window.location.href = '/posts.html'; // Redirect to posts page
        })
        .catch(error => {
            console.error('Error creating posts:', error);
        });
}

//gets the specific user posts
function fetchUserPosts(username) {
    const loginData = JSON.parse(localStorage.getItem('login-data'));

    fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts?username=${username}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${loginData.token}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user posts.');
        }
        return response.json();
    })
    .then(posts => {
        console.log("User Posts:", posts); // Optional: Log fetched posts
        
        // Clear previous posts
        const postsContainer = document.getElementById('userPosts');
        postsContainer.innerHTML = '';

        // Filter posts by the logged-in user
        const userPosts = posts.filter(post => post.username === loginData.username);

        // Display user's posts
        userPosts.forEach(post => {
            postsContainer.appendChild(createUserPostCard(post));
        });
    })
    .catch(error => {
        console.error('Error fetching user posts:', error);
    });
}

//creates the card for the posts
function createUserPostCard(post) {
    // Create main card element
    let cardDiv = document.createElement("div");
    cardDiv.className = "col-12 mb-4";

    // Create card element
    let card = document.createElement("div");
    card.className = "card";

    // Card header
    let cardHeader = document.createElement("div");
    cardHeader.className = "card-header";

    // Avatar
    let avatarImg = document.createElement("img");
    avatarImg.src = "images/avatarimage.png";
    avatarImg.alt = "Avatar";
    avatarImg.className = "rounded-circle me-2";
    avatarImg.style.width = "30px";
    avatarImg.style.height = "30px";
    cardHeader.appendChild(avatarImg);

    // Username
    let usernameSpan = document.createElement("span");
    usernameSpan.textContent = post.username;
    cardHeader.appendChild(usernameSpan);

    // Timestamp
    let timestampSpan = document.createElement("span");
    timestampSpan.textContent = formatTimestamp(post.createdAt);
    timestampSpan.className = "float-end";
    cardHeader.appendChild(timestampSpan);

    card.appendChild(cardHeader);

    // Card body
    let cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // Post text
    let postText = document.createElement("p");
    postText.className = "card-text";
    postText.textContent = post.text;
    cardBody.appendChild(postText);

    card.appendChild(cardBody);

    // Card footer
    let cardFooter = document.createElement("div");
    cardFooter.className = "card-footer bg-light";

    // Like button
    let likeButton = document.createElement("button");
    likeButton.className = "btn btn-sm btn-outline-danger btn-like me-1";
    likeButton.innerHTML = '<i class="fas fa-thumbs-up me-1"></i> Like';
    cardFooter.appendChild(likeButton);

     // Add event listener to toggle like button state
     likeButton.addEventListener("click", function () {
        toggleLike(likeButton);
    });

    // Comment button
    let commentButton = document.createElement("button");
    commentButton.className = "btn btn-sm btn-outline-secondary ms-1";
    commentButton.innerHTML = '<i class="fas fa-comment me-1"></i> Comment';
    cardFooter.appendChild(commentButton);

    card.appendChild(cardFooter);

    cardDiv.appendChild(card);

    return cardDiv;
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp); // Create a Date object from the timestamp string
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

function toggleLike(likeButton) {
    if (likeButton.classList.contains("active")) {
        // Already liked, so unlike (remove active class)
        likeButton.classList.remove("active");
        likeButton.innerHTML = '<i class="fas fa-thumbs-up me-1"></i> Like';
    } else {
        // Not liked, so like (add active class)
        likeButton.classList.add("active");
        likeButton.innerHTML = '<i class="fas fa-thumbs-up me-1"></i> Liked';
    }
}

function fetchUserData(username) {
    fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/users/${username}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("login-data")).token}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user data.');
        }
        return response.json();
    })
    .then(user => {
        console.log("User Data:", user); // Optional: Log fetched user data
        
        // Update user profile information in the DOM
        
        document.getElementById('username').textContent = `Username: @${user.username}`;
        document.getElementById('fullName').textContent = `Full Name: ${user.fullName}`;
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });
}