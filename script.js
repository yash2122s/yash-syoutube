// Sidebar button functionality
document.getElementById('home').addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.getElementById('shorts').addEventListener('click', () => {
    window.location.href = 'shorts.html';
});

document.getElementById('subscriptions').addEventListener('click', () => {
    window.location.href = 'subscriptions.html';
});

document.getElementById('you').addEventListener('click', () => {
    window.location.href = 'you.html';
});

document.getElementById('history').addEventListener('click', () => {
    window.location.href = 'history.html';
});

// Search functionality
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    if(query) {
        console.log(`Searching for: ${query}`);
    }
});

// Add active class to current page
const currentPage = window.location.pathname.split('/').pop().split('.')[0] || 'home';
document.getElementById(currentPage)?.classList.add('active');

// Dark mode toggle functionality
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Check for saved dark mode preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    darkModeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update toggle button icon
        updateDarkModeIcon(newTheme);
    });

    // Initial icon state
    updateDarkModeIcon(savedTheme || 'light');
}

function updateDarkModeIcon(theme) {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (theme === 'dark') {
        darkModeToggle.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" fill="currentColor"/>
            </svg>`;
    } else {
        darkModeToggle.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20V4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20Z" fill="currentColor"/>
            </svg>`;
    }
}

// Initialize dark mode
document.addEventListener('DOMContentLoaded', initDarkMode);

const API_URL = 'https://yash-youtube.onrender.com';

// Add this to test the connection
fetch(`${API_URL}/test`)
    .then(response => response.json())
    .then(data => console.log('Server test:', data))
    .catch(error => console.error('Server test error:', error));

async function loadVideos() {
    try {
        const response = await fetch(`${API_URL}/api/videos`);
        const videos = await response.json();
        const videosGrid = document.getElementById('videosGrid');
        
        videosGrid.innerHTML = videos.map(video => `
            <div class="video-card">
                <video controls>
                    <source src="${API_URL}/${video.filename}" type="video/mp4">
                </video>
                <div class="video-info">
                    <h3>${video.title}</h3>
                    <p>${video.description}</p>
                    <span>${video.views} views • ${new Date(video.uploadDate).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

// Handle video upload
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const formData = new FormData();
        const title = document.getElementById('videoTitle').value;
        const description = document.getElementById('videoDescription').value;
        const videoFile = document.getElementById('videoFile').files[0];

        if (!videoFile) {
            throw new Error('Please select a video file');
        }

        formData.append('title', title);
        formData.append('description', description);
        formData.append('video', videoFile);

        console.log('Starting upload...');

        const response = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            body: formData
        });

        console.log('Upload response status:', response.status);
        
        const result = await response.json();
        console.log('Upload result:', result);

        if (result.success) {
            alert('Video uploaded successfully!');
            location.reload();
        } else {
            throw new Error(result.error || 'Upload failed');
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert(`Upload failed: ${error.message}`);
    }
});

// Add this to check if form exists
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    if (!form) {
        console.error('Upload form not found!');
    }
});

// Load videos when page loads
document.addEventListener('DOMContentLoaded', loadVideos);
