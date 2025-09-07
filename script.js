document.addEventListener('DOMContentLoaded', () => {
    // Inicialização do Swiper.js para o slideshow
    const swiper = new Swiper('.swiper-container', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // Substituir ícones do Lucide
    lucide.createIcons();

    // Menu mobile
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // --- Lógica do Tema Escuro/Claro ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('theme-toggle-sun');
    const moonIcon = document.getElementById('theme-toggle-moon');

    // Verifica o tema salvo no localStorage ao carregar a página
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        sunIcon.classList.toggle('hidden');
        moonIcon.classList.toggle('hidden');

        // Salva a preferência do usuário no localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });


    // Animação de fade-in ao rolar
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.3,
        rootMargin: "0px 0px -50px 0px"
    };
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => appearOnScroll.observe(fader));
    
    // --- Lógica do Carrinho e Modals ---

    // Elementos do Modal de Carrinho
    const cartIcon = document.getElementById('cart-icon');
    const cartBadge = document.getElementById('cart-badge');
    const whatsappModal = document.getElementById('whatsapp-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cartItemsList = document.getElementById('cart-items-list');
    const finalizeOrderBtn = document.getElementById('finalize-order-btn');

    // Elementos do Modal de Detalhes do Produto
    const productDetailModal = document.getElementById('product-detail-modal');
    const closeProductModalBtn = document.getElementById('close-product-modal-btn');
    const productModalImage = document.getElementById('product-modal-image');
    const productModalName = document.getElementById('product-modal-name');
    const productModalDescription = document.getElementById('product-modal-description');
    const productModalAddBtn = document.getElementById('product-modal-add-btn');

    // Elementos do Modal de Pesquisa
    const searchIcon = document.getElementById('search-icon');
    const searchModal = document.getElementById('search-modal');
    const closeSearchBtn = document.getElementById('close-search-btn');
    const searchInput = document.getElementById('search-input');
    const searchResultsList = document.getElementById('search-results-list');
    
    let allProducts = [];
    let cartItems = [];

    // Função para coletar todos os produtos da página
    const collectAllProducts = () => {
        const productCards = document.querySelectorAll('.card-product');
        productCards.forEach(card => {
            allProducts.push({
                name: card.dataset.name,
                description: card.dataset.description,
                image: card.querySelector('img').src,
            });
        });
    };
    collectAllProducts();

    // Função para adicionar item ao carrinho
    const addToCart = (product) => {
        cartItems.push(product);
        cartBadge.textContent = cartItems.length;
        if (cartItems.length > 0) {
            cartBadge.classList.add('active');
        }
    };
    
    // Atualiza a visualização do modal de carrinho
    const updateCartModal = () => {
        cartItemsList.innerHTML = ''; // Limpa a lista
        if (cartItems.length === 0) {
            cartItemsList.innerHTML = '<p class="text-gray-500">Seu carrinho está vazio.</p>';
            finalizeOrderBtn.disabled = true;
        } else {
            cartItems.forEach(item => {
                const li = document.createElement('div');
                li.className = 'flex justify-between items-center';
                li.innerHTML = `<span>${item.name}</span>`;
                cartItemsList.appendChild(li);
            });
            finalizeOrderBtn.disabled = false;
        }
    };

    // Adiciona item ao carrinho A PARTIR DO CARD
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.card-product');
            const name = card.dataset.name;
            addToCart({ name });
            
            // Feedback visual para o usuário
            const originalText = button.innerHTML;
            button.innerHTML = '<i data-lucide="check" class="w-5 h-5"></i> <span>Adicionado!</span>';
            lucide.createIcons();
            setTimeout(() => {
                button.innerHTML = originalText;
                lucide.createIcons();
            }, 1500);
        });
    });

    // Abrir o modal de carrinho
    const openCartModal = (e) => {
        if (e) e.preventDefault();
        updateCartModal();
        whatsappModal.classList.remove('hidden');
    };

    // Fechar o modal de carrinho
    const closeCartModal = () => {
        whatsappModal.classList.add('hidden');
    };
    
    // Event listeners para o modal de carrinho
    cartIcon.addEventListener('click', openCartModal);
    closeModalBtn.addEventListener('click', closeCartModal);
    whatsappModal.addEventListener('click', (e) => {
        if (e.target === whatsappModal) {
            closeCartModal();
        }
    });

    // --- Lógica do Modal de Detalhes do Produto ---

    // Abrir o modal de detalhes do produto
    const openProductModal = (product) => {
        productModalImage.src = product.image;
        productModalName.textContent = product.name;
        productModalDescription.textContent = product.description;
        
        // Armazena os dados no botão do modal para serem usados ao adicionar ao carrinho
        productModalAddBtn.dataset.name = product.name;

        productDetailModal.classList.remove('hidden');
        lucide.createIcons();
    };

    // Fechar o modal de detalhes do produto
    const closeProductModal = () => {
        productDetailModal.classList.add('hidden');
    };
    
    // Event Listeners para o modal de detalhes do produto
    closeProductModalBtn.addEventListener('click', closeProductModal);
    productDetailModal.addEventListener('click', (e) => {
        if (e.target === productDetailModal) {
            closeProductModal();
        }
    });
    
    // Adicionar item ao carrinho A PARTIR DO MODAL DE DETALHES
    productModalAddBtn.addEventListener('click', (e) => {
        const name = e.currentTarget.dataset.name;
        addToCart({ name });
        
        // Feedback visual e fechar modal
        const originalText = productModalAddBtn.innerHTML;
        productModalAddBtn.innerHTML = '<i data-lucide="check" class="w-5 h-5"></i> <span>Adicionado!</span>';
        lucide.createIcons();
        setTimeout(() => {
            productModalAddBtn.innerHTML = originalText;
            lucide.createIcons();
            closeProductModal();
        }, 1500);
    });

    // Adiciona evento de clique para cada botão "Ver detalhes"
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.card-product');
            const name = card.dataset.name;
            const description = card.dataset.description;
            const image = card.querySelector('img').src;
            
            openProductModal({ name, description, image });
        });
    });
    
    // --- Lógica da Pesquisa ---
    
    // Abrir/Fechar modal de pesquisa
    searchIcon.addEventListener('click', (e) => {
        e.preventDefault();
        searchModal.classList.remove('hidden');
        searchInput.focus();
    });

    const closeSearchModal = () => {
        searchModal.classList.add('hidden');
        searchInput.value = '';
        searchResultsList.innerHTML = '<p class="text-center text-gray-500">Digite algo para começar a buscar.</p>';
    };

    closeSearchBtn.addEventListener('click', closeSearchModal);
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            closeSearchModal();
        }
    });
    
    // Função para exibir resultados da pesquisa
    const displaySearchResults = (results) => {
        searchResultsList.innerHTML = '';

        if (results.length === 0) {
            searchResultsList.innerHTML = '<p class="text-center text-gray-500">Nenhum produto encontrado.</p>';
            return;
        }

        results.forEach(product => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item flex items-center gap-4 p-4 rounded-lg cursor-pointer';
            resultItem.dataset.name = product.name;
            resultItem.dataset.description = product.description;
            resultItem.dataset.image = product.image;

            resultItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded-md flex-shrink-0">
                <div class="flex-grow">
                    <p class="font-semibold text-lg">${product.name}</p>
                </div>
            `;
            searchResultsList.appendChild(resultItem);
        });
        
        // Adiciona evento para abrir detalhes do produto a partir dos resultados
        document.querySelectorAll('#search-results-list div').forEach(item => {
            item.addEventListener('click', () => {
                openProductModal({
                    name: item.dataset.name,
                    description: item.dataset.description,
                    image: item.dataset.image,
                });
                closeSearchModal();
            });
        });
    };

    // Event listener para o input de pesquisa
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        if (searchTerm.length < 2) {
            searchResultsList.innerHTML = '<p class="text-center text-gray-500">Digite pelo menos 2 caracteres.</p>';
            return;
        }

        const filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );

        displaySearchResults(filteredProducts);
    });


    // Finalizar pedido no WhatsApp (do carrinho)
    finalizeOrderBtn.addEventListener('click', () => {
        // IMPORTANTE: Substitua 'SEUNUMERO' pelo seu número de WhatsApp com código do país
        const phoneNumber = '5584999999999'; // Ex: 5511999999999
        
        let message = 'Olá! Gostaria de solicitar um orçamento para os seguintes produtos:\n\n';
        
        cartItems.forEach(item => {
            message += `- ${item.name}\n`;
        });

        message += `\nFico no aguardo.`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    });
    
    // Lógica para o link direto do WhatsApp
    const directWhatsappLink = document.getElementById('direct-whatsapp-link');
    if (directWhatsappLink) {
        directWhatsappLink.addEventListener('click', (e) => {
            e.preventDefault();
            // IMPORTANTE: Substitua 'SEUNUMERO' pelo seu número de WhatsApp com código do país
            const phoneNumber = '5584999999999'; // Ex: 5511999999999
            const message = 'Olá! Vim pelo site e gostaria de mais informações sobre os produtos.';
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }


    // Lógica para "Ver mais" produtos
    const toggleProductsBtn = document.getElementById('toggle-products-btn');
    const hiddenProducts = document.querySelectorAll('.hidden-product');
    if (toggleProductsBtn) {
        toggleProductsBtn.addEventListener('click', () => {
            hiddenProducts.forEach(product => {
                product.classList.toggle('hidden');
            });
            toggleProductsBtn.textContent = toggleProductsBtn.textContent === 'Ver mais' ? 'Ver menos' : 'Ver mais';
        });
    }

    // Lógica para "Ver mais" produtos PARCEIROS
    const togglePartnerProductsBtn = document.getElementById('toggle-partner-products-btn');
    const hiddenPartnerProducts = document.querySelectorAll('.hidden-partner-product');
    if (togglePartnerProductsBtn) {
        togglePartnerProductsBtn.addEventListener('click', () => {
            hiddenPartnerProducts.forEach(product => {
                product.classList.toggle('hidden');
            });
            togglePartnerProductsBtn.textContent = togglePartnerProductsBtn.textContent === 'Ver mais' ? 'Ver menos' : 'Ver mais';
        });
    }
});

