// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAp6Cs50J5Zdq8GSywVN1oQa9webzFJ8Go",
    authDomain: "psa-showcase-2.firebaseapp.com",
    projectId: "psa-showcase-2",
    storageBucket: "psa-showcase-2.appspot.com",
    messagingSenderId: "165758664577",
    appId: "1:165758664577:web:1a8406a63f0d7ddc4df280",
    measurementId: "G-V4L2S7CC6K"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Load scripts from Firestore
function loadScripts() {
    const scriptsDiv = document.getElementById('scripts');
    db.collection('scripts').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const scriptData = doc.data();
            const scriptElement = document.createElement('div');
            scriptElement.classList.add('script');
            scriptElement.innerHTML = `
                <h3>${scriptData.title}</h3>
                <p>${scriptData.content}</p>
                <div class="comments">
                    <h4>Comments</h4>
                    <div class="comment-list"></div>
                    <textarea placeholder="Add a comment"></textarea>
                    <button class="add-comment">Comment</button>
                </div>
            `;
            scriptsDiv.appendChild(scriptElement);

            loadComments(doc.id, scriptElement.querySelector('.comment-list'));

            scriptElement.querySelector('.add-comment').addEventListener('click', () => {
                const commentText = scriptElement.querySelector('textarea').value;
                addComment(doc.id, commentText);
            });
        });
    });
}

// Load comments for a specific script
function loadComments(scriptId, commentList) {
    db.collection('scripts').doc(scriptId).collection('comments').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const commentData = doc.data();
            const commentElement = document.createElement('p');
            commentElement.textContent = commentData.text;
            commentList.appendChild(commentElement);
        });
    });
}

// Add a new comment to a script
function addComment(scriptId, commentText) {
    db.collection('scripts').doc(scriptId).collection('comments').add({
        text: commentText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log('Comment added!');
    }).catch((error) => {
        console.error('Error adding comment: ', error);
    });
}

// Save a new script
document.getElementById('saveScript').addEventListener('click', () => {
    const scene1 = document.getElementById('scene1').value;
    const description1 = document.getElementById('description1').value;
    const scene2 = document.getElementById('scene2').value;
    const description2 = document.getElementById('description2').value;

    const newScript = {
        title: `New Script - ${new Date().toLocaleDateString()}`,
        content: `Scene 1: ${scene1} - ${description1}\nScene 2: ${scene2} - ${description2}`
    };

    db.collection('scripts').add(newScript).then(() => {
        console.log('New script added!');
        loadScripts();  // Reload scripts to display the new script
    }).catch((error) => {
        console.error('Error adding script: ', error);
    });
});

// Load scripts on page load
document.addEventListener('DOMContentLoaded', () => {
    loadScripts();
});
