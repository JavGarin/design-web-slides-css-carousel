// Array of product data. Each object represents a product with its details.
const products = [
    {
        title: "Juice Punch, Flavor Coffee",
        price: "$ 10 USD",
        description: "Juice Punch, Sabor Café. El Golpe Doble. Despierta con el intenso aroma del café y ataca con la explosión frutal del punch. La fusión definitiva: la energía profunda de tu café favorito potenciada con la vitalidad eléctrica de las frutas. Doble combustible para un día imparable. La energía que despierta y acelera. #JuicePunch #CoffeePunch #DobleEnergía",
        image: "images/juice-punch.png",
        bgColor: "#9c4d2f",
        figcaption: "Juice Punch, a new product"
    },
    {
        title: "Berry Pink, Flavor Sweet",
        price: "$ 15 usd",
        description: "Berry Pink: Energía Dulce y Vibrante. Más que una bebida, es una experiencia rosa. El dulce y vibrante sabor a fresa silvestre que te da el impulso de energía que buscas, envuelto en una frescura irresistible. Perfecta para endulzar tu ritmo y brillar con tu propia luz. Dulce energía. Vibrante actitud. #StrawberryPink #SweetEnergy #BrillaComoTú",
        image: "images/energy-pink.png",
        bgColor: "#f5bfaf",
        figcaption: "Berry Pink, a new product"
    },
    {
        title: "Ferno Energy, Flavor intense",
        price: "$ 12 usd",
        description: "Strong Energy: Tu Combustible Definitivo. Potencia concentrada para tu pre-entreno. Fórmula con cafeína, beta-alanina y aminoácidos que dispara tu energía, enfoque y resistencia desde el primer sorbo. Domina cada serie. Retrasa la fatiga. Supera tus límites. La chispa que enciende tu fuerza. #StrongEnergy",
        image: "images/energy-strong.png",
        bgColor: "#c62f17ff",
        figcaption: "Strong Energy, a new product"
    },
    {
        title: "Energy Hulk, Flavor acid",
        price: "$ 11 USD",
        description: "Energy Hulk, Sabor Limonada. ¡Fuerza Irrompible! La energía más poderosa se viste de verde y sabe a limonada explosiva. Una fórmula extrema que carga tus músculos con fuerza bruta y una claridad mental de acero. Para los que no conocen límites. Potencia extrema. Sabor invencible. #EnergyHulkPlus #FuerzaBruta #SomosHulk",
        image: "images/energy-hulk.png",
        bgColor: "#7eb63d",
        figcaption: "Energy Hulk, a new product"
    }
];

/**
 * Renders the product items in the carousel.
 * It dynamically creates the HTML for each product and adds it to the DOM.
 */
function renderProducts() {
    const list = document.querySelector('.carousel .list');
    list.innerHTML = ''; // Clear existing items

    products.forEach((product, index) => {
        const item = document.createElement('article');
        item.classList.add('item');
        // Set initial classes for the first three items
        if (index === 1) item.classList.add('active');
        if (index === 0) item.classList.add('other_1');
        if (index === 2) item.classList.add('other_2');

        item.innerHTML = `
            <div class="main-content" style="background-color: ${product.bgColor};">
                <div class="content">
                    <h2>${product.title}</h2>
                    <p class="price">${product.price}</p>
                    <p class="description">${product.description}</p>
                    <button class="addToCard">Add To Card</button>
                </div>
            </div>
            <figure class="image">
                <img src="${product.image}" alt="${product.title}">
                <figcaption>${product.figcaption}</figcaption>
            </figure>
        `;
        list.appendChild(item);
    });
}

/**
 * Initializes the carousel functionality.
 * Sets up event listeners for the next and previous buttons and the autoplay feature.
 */
function startCarousel() {
    // DOM elements for carousel controls
    const next = document.getElementById('next');
    const prev = document.getElementById('prev');
    const carousel = document.querySelector('.carousel');
    const items = document.querySelectorAll('.carousel .item');
    const countItem = items.length;

    // State variables for the carousel
    let active = 1;
    let other_1 = 0;
    let other_2 = 2;
    let autoPlay;

    /**
     * Updates the carousel slides with the correct classes and resets animations.
     */
    function changeSlider() {
        // Remove active classes from all items
        items.forEach(item => item.classList.remove('active', 'other_1', 'other_2'));

        // Reset animations by triggering a reflow
        items.forEach(e => {
            e.querySelector('.image img').style.animation = 'none';
            e.querySelector('.image figcaption').style.animation = 'none';
            void e.offsetWidth; // Trigger reflow
            e.querySelector('.image img').style.animation = '';
            e.querySelector('.image figcaption').style.animation = '';
        });

        // Add active classes to the correct items
        items[active].classList.add('active');
        items[other_1].classList.add('other_1');
        items[other_2].classList.add('other_2');

        // Reset autoplay timer
        clearInterval(autoPlay);
        autoPlay = setInterval(() => next.click(), 5000);
    }

    // Event listener for the next button
    next.onclick = () => {
        carousel.classList.remove('prev');
        carousel.classList.add('next');
        active = (active + 1) % countItem;
        other_1 = (active - 1 + countItem) % countItem;
        other_2 = (active + 1) % countItem;
        changeSlider();
    };

    // Event listener for the previous button
    prev.onclick = () => {
        carousel.classList.remove('next');
        carousel.classList.add('prev');
        active = (active - 1 + countItem) % countItem;
        other_1 = (active + 1) % countItem;
        other_2 = (other_1 + 1) % countItem;
        changeSlider();
    };

    // Initialize autoplay
    autoPlay = setInterval(() => next.click(), 5000);
}

// Start the carousel logic after the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    startCarousel();

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger-menu');
    const header = document.querySelector('header');
    hamburger.addEventListener('click', () => {
        header.classList.toggle('nav-active');
    });
});