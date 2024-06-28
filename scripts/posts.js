/* Posts Page JavaScript */

"use strict";


const postCards = document.getElementById("postCards");


document.getElementById('logoutButton').addEventListener('click', function () {
    logout();
});

window.onload = function () {
    fetchPosts();
    fetchUsers();
};

//fetches all posts and calls the function createPostCard
function fetchPosts() {
    fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts", {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("login-data")).token}`,
        },
    })
        .then(response => response.json())
        .then(posts => {
            console.log("Posts:", posts); // Optional: Log fetched posts
            posts.forEach(post => {
                postCards.appendChild(createPostCard(post));
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
}


//created the card for each post 
function createPostCard(post) {
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

//gets the list of users
function fetchUsers() {
    fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/users", {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("login-data")).token}`,
        },
    })
        .then(response => response.json())
        .then(users => {
            console.log("Users:", users); // Optional: Log fetched users
            let userList = document.getElementById("userList");
            users.forEach(user => {
                userList.appendChild(createUserItem(user));
            });
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
}

//displays the list of users
function createUserItem(user) {
    // Create list item
    let listItem = document.createElement("a");
    listItem.className = "list-group-item list-group-item-action";
    listItem.href = "#"; // Adjust as needed

    // Avatar
    let avatarImg = document.createElement("img");
    avatarImg.src = "images/avatarimage.png";
    avatarImg.alt = "Avatar";
    avatarImg.className = "rounded-circle me-2";
    avatarImg.style.width = "30px";
    avatarImg.style.height = "30px";
    listItem.appendChild(avatarImg);

    // Username
    let usernameSpan = document.createElement("span");
    usernameSpan.textContent = user.username;
    listItem.appendChild(usernameSpan);

    return listItem;
}


//changes the format of timestamp 
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

// Function to toggle like button
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