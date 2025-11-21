 // Sample news data
      let newsData = JSON.parse(localStorage.getItem("newsData")) || [
      { title: "Scientists Achieve Breakthrough in Quantum Computing", category: "tech", date: "2 hours ago", img: "quantum" },
      { title: "Nigeria's Economy Shows Strong Recovery in Q3 2025", category: "business", date: "5 hours ago", img: "economy" },
      { title: "Super Eagles Qualify for 2026 World Cup", category: "sports", date: "Yesterday", img: "football" },
      { title: "New Climate Agreement Reached at COP31", category: "world", date: "3 hours ago", img: "climate" },
      { title: "President Announces Major Infrastructure Projects", category: "politics", date: "Nov 16, 2025", img: "infrastructure" }
    ];


        const articlesGrid = document.getElementById('articles-grid');
        let visibleCount = 6;

        function renderArticles(filter = 'all') {
          articlesGrid.innerHTML = '';
          const filtered = filter === 'all' ? newsData : newsData.filter(n => n.category === filter);
          
          filtered.slice(0, visibleCount).forEach(article => {
            const articleEl = document.createElement('div');
            articleEl.className = 'article-card';
            articleEl.innerHTML = `
            <img src="${article.img && article.img.startsWith('data:') ? article.img : 'https://source.unsplash.com/random/600x400/?' + (article.img || 'news')}" alt="${article.title}" class="article-img">

            <div class="article-body">
                <span class="category-label">${article.category}</span>
                <h3 class="article-title"><a href="#">${article.title}</a></h3>
                <div class="article-meta">${article.date} </div>
              </div>
            `;
            articlesGrid.appendChild(articleEl);
          });
        }

        // Category filter
        document.querySelectorAll('.cat-tab').forEach(tab => {
          tab.addEventListener('click', () => {
            document.querySelector('.cat-tab.active').classList.remove('active');
            tab.classList.add('active');
            visibleCount = 6;
            renderArticles(tab.dataset.category);
          });
        });

        // Load more
        document.getElementById('load-more').addEventListener('click', () => {
          visibleCount += 6;
          const activeCat = document.querySelector('.cat-tab.active').dataset.category;
          renderArticles(activeCat);
        });

        // Mobile menu
        document.getElementById('hamburger').addEventListener('click', () => {
          document.getElementById('nav-menu').classList.toggle('show');
        });

        // Initial render
        renderArticles();


    let selectedImageBase64 = "";
    let tempArticle = {};

    // OPEN Step 1 modal
    document.getElementById('compose-btn').addEventListener('click', () => {
    document.getElementById('compose-modal').style.display = 'flex';
    });

    // CLOSE Step 1
    document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('compose-modal').style.display = 'none';
    });

    // PHOTO UPLOAD → convert to Base64
    document.getElementById('news-photo').addEventListener('change', function() {
      const file = this.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        selectedImageBase64 = e.target.result;
      };
      reader.readAsDataURL(file);
    });

    // STEP 1 → STEP 2
    document.getElementById('next-step').addEventListener('click', () => {
      const title = document.getElementById('news-title').value.trim();
      const category = document.getElementById('news-category').value;

      if (!title) {
        alert("Please enter a headline.");
        return;
      }

      tempArticle = {
        title,
        category,
        img: selectedImageBase64 || "news"
      };

      document.getElementById('compose-modal').style.display = 'none';
      document.getElementById('body-editor-modal').style.display = 'flex';
    });

    // CLOSE Step 2
    document.getElementById('close-body-editor').addEventListener('click', () => {
      document.getElementById('body-editor-modal').style.display = 'none';
    });

    // AUTO DATE GENERATOR - returns readable time
    function generatePostDate() {
      const now = new Date();
      return now.toLocaleString('en-US', {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric"
      });
    }

    // PUBLISH STORY
    document.getElementById('post-news').addEventListener('click', () => {
      const bodyText = document.getElementById('news-body').value.trim();
      if (!bodyText) {
        alert("Please write the news body.");
        return;
      }

      tempArticle.date = generatePostDate();
      tempArticle.body = bodyText;

      newsData.unshift(tempArticle);
      localStorage.setItem("newsData", JSON.stringify(newsData));


      // Reset temporary data
      selectedImageBase64 = "";
      tempArticle = {};
      document.getElementById('news-body').value = "";

      // Close modal
      document.getElementById('body-editor-modal').style.display = 'none';

      // Re-render articles
      renderArticles(document.querySelector('.cat-tab.active').dataset.category);

      alert("News story published!");
    });



    // Array of hero articles (you can load this from your own news data)
    const heroArticles = [
      {
        title: "Breaking: Major Peace Agreement Signed in Middle East",
        description: "Historic deal reached after months of negotiations brings hope for lasting stability in the region.",
        img: "https://source.unsplash.com/1600x900/?middle-east,peace",
        link: "#"
      },
      {
        title: "Global Markets Rally After Positive Economic Forecast",
        description: "Investors show renewed confidence as world banks predict strong economic growth.",
        img: "https://source.unsplash.com/1600x900/?economy,stock-market",
        link: "#"
      },
      {
        title: "Scientists Announce Breakthrough in Renewable Energy",
        description: "New solar technology promises to triple energy output at lower cost.",
        img: "https://source.unsplash.com/1600x900/?solar,technology",
        link: "#"
      }
    ];

    let currentSlide = 0;
    const slideContainer = document.getElementById("hero-slide");

    // Load slides into DOM
    function loadHeroSlides() {
      heroArticles.forEach((article, index) => {
        const slide = document.createElement("div");
        slide.classList.add("hero-item");
        if (index === 0) slide.classList.add("active");

        slide.style.backgroundImage = `url(${article.img})`;

        slide.innerHTML = `
          <h1>${article.title}</h1>
          <p>${article.description}</p>
          <a href="#" class="btn" onclick='openHeroArticle(${JSON.stringify(article)})'>Read Full Story</a>
          `;
        slideContainer.appendChild(slide);
      });
    }

    // Switch slides automatically
      function startHeroRotation() {
      const slides = document.querySelectorAll(".hero-item");

      setInterval(() => {
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
      }, 5000); // 5 seconds
    }

    loadHeroSlides();
    startHeroRotation();


    function openHeroArticle(article) {
      localStorage.setItem("selectedArticle", JSON.stringify(article));
      window.location.href = "article.html";
    }

    // Top-bar Date
    function updateTopBarDate() {
      const dateElement = document.getElementById("top-date");

      const today = new Date();

      const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      };

      const formattedDate = today.toLocaleDateString("en-US", options);

      dateElement.textContent = `${formattedDate} — Breaking News, Latest Headlines & Live Updates`;
    }

    // Run immediately
    updateTopBarDate();

    // Update automatically every midnight
    setInterval(updateTopBarDate, 1000 * 60 * 60);




  const signinBtn = document.getElementById('signin-btn');

  function updateSignInButton() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (user && user.username) {
      signinBtn.textContent = 'Log Out';
      signinBtn.removeEventListener('click', handleSignIn); // remove previous listener
      signinBtn.addEventListener('click', handleLogOut);
    } else {
      signinBtn.textContent = 'Sign In';
      signinBtn.removeEventListener('click', handleLogOut); // remove previous listener
      signinBtn.addEventListener('click', handleSignIn);
    }
  }

  function handleSignIn() {
    window.location.href = 'auth.html';
  }

  function handleLogOut() {
    localStorage.removeItem('loggedInUser');
    updateSignInButton();
    alert('You have been logged out.');
  }

  // Run on page load
  document.addEventListener('DOMContentLoaded', updateSignInButton);

  // Listen for login/logout changes from other tabs/windows
  window.addEventListener('storage', updateSignInButton);



  document.getElementById("close-modal").addEventListener("click", () => {
  // CLOSE MODAL
  document.getElementById("compose-modal").style.display = "none";

  // RESET ALL INPUT FIELDS
  document.getElementById("news-title").value = "";
  document.getElementById("news-category").value = "world";
  document.getElementById("news-photo").value = "";
});


document.getElementById("close-body-editor").addEventListener("click", () => {
  // CLOSE MODAL
  document.getElementById("compose-modal").style.display = "none";

  // RESET ALL INPUT FIELDS
  document.getElementById("news-title").value = "";
  document.getElementById("news-category").value = "world";
  document.getElementById("news-photo").value = "";
});

// Logout  
document.getElementById("logout-btn").addEventListener("click", () => {
      window.location.href = "auth.html";
    
})

document.getElementById("profile-btn").addEventListener("click", () => {
  window.location.href = "profile.html"
})