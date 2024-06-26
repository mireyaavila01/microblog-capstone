/* Posts Page JavaScript */

"use strict";


const postCards = document.getElementById("postCards");


document.getElementById('logoutButton').addEventListener('click', function () {
    logout();
});
window.onload = function () {
    fetchPosts();
};


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

function createPostCard(post) {
    let cardDiv = document.createElement("div");
    cardDiv.className = "card text-center mb-4";

    let cardHeader = document.createElement("div");
    cardHeader.className = "card-header";
    cardHeader.innerHTML = formatTimestamp(post.createdAt); //the timestamp from the post 
    cardDiv.appendChild(cardHeader);

    let cardBody = document.createElement("div");
    cardBody.className = "card-body";
    cardDiv.appendChild(cardBody);

    let bodyHeading = document.createElement("h5");
    bodyHeading.className = "card-title"
    bodyHeading.innerHTML = post.username; //the username from the post
    cardBody.appendChild(bodyHeading);

    let bodyPara = document.createElement("p");
    bodyPara.className = "card-text";
    bodyPara.innerHTML = post.text //the text from the post 
    cardBody.appendChild(bodyPara);

    let cardFooter = document.createElement("div");
    cardFooter.className = "card-footer text-body-secondary";

    let thumbsUp = document.createElement("i");
    thumbsUp.className = "fas fa-thumbs-up"

    cardFooter.appendChild(thumbsUp);
    cardDiv.appendChild(cardFooter);

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