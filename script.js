const API_KEY = "9892808218a44079bdf63767c1809c56";

const url = "https://newsapi.org/v2/everything?q=";

const reload = () => {
    window.location.reload();
}
const fetchNews = async (query) => {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        const data = await res.json();
        console.log(data);
        bindData(data.articles);
    } catch (error) {
        console.log("error");
        document.getElementById('cardContainer').innerText = 'Process Faliure...';
    }
};

const fetchSummarizedData = async (url2) => {
    try {
    const response = await fetch(`https://article-extractor-and-summarizer.p.rapidapi.com/summarize?url=${url2}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'a323285aecmsh2b6b2164e65acb4p184469jsn17c3db27ea22',
                'x-rapidapi-host': 'article-extractor-and-summarizer.p.rapidapi.com',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        const cleanedText = responseText.replace(/\\/g, '').replace(/\//g, '').replace(/\n/g, ' ').replace(/n-/g, '').replace(/}/g,'').replace(/{/g,'').replace(/"/g,'');
        console.log(cleanedText);
        return cleanedText;
    } catch (error) {
        console.error('Error fetching summarized data:', error);
        return 'Failed to fetch summarized data...';
    }
};
const bindData = (articles) => {
    const cardContainer = document.getElementById("cardContainer");
    const newsCardTemplate = document.getElementById("templateNews");
    cardContainer.innerHTML = " ";
    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);


        const askAi = cardClone.querySelector('.askAi');
        askAi.addEventListener('click', async function (event) {
            event.stopPropagation();
            overlay.style.visibility = 'visible';
            setTimeout(function () {
                overlay.classList.add('open');
                popup.classList.add('open');
            }, 500);
        //functionalities for the secont api call
        popup.innerHTML = "Summarizing your news...";
        let url2 = article.url;
        const summary = await fetchSummarizedData(url2);
        popup.innerHTML = summary;
        });

        const overlay = document.getElementById('overlay');
        const popup = document.getElementById('popup');
       
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                popup.innerHTML = " ";
                overlay.classList.remove('open');
                popup.classList.remove('open');
                setTimeout(function () {
                    overlay.style.visibility = 'hidden';
                }, 100);
            }
        });
        cardContainer.appendChild(cardClone);
    });

  
};
const fillDataInCard = (cardClone, article) => {
    const newsImage = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#newsSource');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImage.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    });
    newsSource.innerHTML = `${article.source.name} . ${date}`;

    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank");
    })
}
curSelectedNav = null;
const onNavItemClick = (id) => {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
};

const searchBtn = document.getElementById('searchButton');
const searchText = document.querySelector('.newsInput');

searchBtn.addEventListener('click', () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = null;
});


window.addEventListener("load", fetchNews("India"));


//back to top button
let topButton = document.getElementById("topButton");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        topButton.style.display = "block";
    } else {
        topButton.style.display = "none";
    }
}

topButton.onclick = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};


// JavaScript to toggle the navigation menu
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navlink = document.querySelector('.navlink');

    hamburger.addEventListener('click', () => {
        navlink.classList.toggle('active'); 
        hamburger.classList.toggle('active'); 
    });
});
