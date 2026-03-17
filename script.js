document.addEventListener('DOMContentLoaded', () => {
    const isLoginPage = window.location.href.includes('login.html') || window.location.pathname.includes('/login');
    const isAdminPage = window.location.href.includes('admin.html') || window.location.pathname.includes('/admin');
    
    // Check authentication for admin page
    if (isAdminPage && sessionStorage.getItem('bloomAdminLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Handle Login Page Logic
    if (isLoginPage) {
        const loginForm = document.getElementById('login-form');
        const loginError = document.getElementById('login-error');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                // Using hardcoded credentials for demonstration
                if (username === 'admin' && password === 'admin123') {
                    sessionStorage.setItem('bloomAdminLoggedIn', 'true');
                    window.location.href = 'admin.html';
                } else {
                    loginError.style.display = 'block';
                }
            });
        }
        return; // Important to stop execution of the rest of the script on login page
    }

    const isAdmin = !!document.getElementById('add-product-btn');
    
    const productsGrid = document.getElementById('products-grid');
    const categoriesList = document.getElementById('categories-list');
    
    // Load Dynamic Shop Information
    let shopInfo = JSON.parse(localStorage.getItem('bloomShopInfo')) || {
        name: 'Naveen Flower Shop',
        description: 'Browse our beautiful flower collections'
    };
    
    // Apply Shop Information to the view
    const displayShopName = document.getElementById('display-shop-name');
    const displayShopDesc = document.getElementById('display-shop-desc');
    
    if (displayShopName) {
        displayShopName.textContent = shopInfo.name;
        document.title = shopInfo.name; // Also update page title
    }
    if (displayShopDesc) {
        displayShopDesc.textContent = shopInfo.description;
    }

    // Admin functionality variables
    let modal, categoryModal, shopInfoModal;
    let openModalBtn, openCategoryModalBtn, openShopInfoBtn;
    let closeBtn, closeCategoryBtn, closeShopInfoBtn;
    let form, categoryForm, shopInfoForm;
    let productCategorySelect, imageInput, imagePreview, modalTitle;

    // Added elements mapped to top level variables to avoid scope errors
    form = document.getElementById('product-form');
    categoryForm = document.getElementById('category-form');
    productCategorySelect = document.getElementById('product-category');
    imageInput = document.getElementById('product-img');
    imagePreview = document.getElementById('image-preview');
    modalTitle = document.getElementById('modal-title');
    shopInfoForm = document.getElementById('shop-info-form');
    
    const categoriesToggle = document.getElementById('categories-toggle');
    const categoriesDropdown = document.getElementById('categories-dropdown');
    const currentCategoryTitle = document.getElementById('current-category-title');

    if (isAdmin) {
        modal = document.getElementById('product-modal');
        categoryModal = document.getElementById('category-modal');
        shopInfoModal = document.getElementById('shop-info-modal');
        
        openModalBtn = document.getElementById('add-product-btn');
        openCategoryModalBtn = document.getElementById('add-category-btn');
        openShopInfoBtn = document.getElementById('edit-shop-info-btn');
        
        closeBtn = document.querySelector('.close-btn');
        closeCategoryBtn = document.querySelector('.close-category-btn');
        closeShopInfoBtn = document.querySelector('.close-shop-info-btn');
        

        
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                sessionStorage.removeItem('bloomAdminLoggedIn');
                window.location.href = 'index.html';
            });
        }
    }
    
    let products = JSON.parse(localStorage.getItem('flowerShopProducts')) || [];
    let categories = JSON.parse(localStorage.getItem('flowerShopCategories')) || [];
    let currentImagesBase64 = [];
    let currentCategoryFilter = 'all';

    // Load initial categories
    if(categories.length === 0) {
        categories = [
            { id: 'cat_1', name: 'Bouquets' },
            { id: 'cat_2', name: 'Indoor Plants' },
            { id: 'cat_3', name: 'Gifts' }
        ];
        saveCategories();
    }
    if(products.length === 0) {
        const dummyData = [
            {
                id: generateId(),
                name: 'Elegant Red Roses',
                price: '45.00',
                categoryId: 'cat_1',
                image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb29?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: generateId(),
                name: 'Sunflowers Bouquet',
                price: '30.99',
                categoryId: 'cat_1',
                image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: generateId(),
                name: 'White Lilies',
                price: '55.50',
                categoryId: 'cat_3',
                image: 'https://images.unsplash.com/photo-1582791694770-bd9ce8c97dd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            }
        ];
        products = dummyData;
        saveProducts();
    }
    // Dropdown toggle events
    
    if (categoriesToggle && categoriesDropdown) {
        categoriesToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            categoriesDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!categoriesDropdown.contains(e.target) && e.target !== categoriesToggle) {
                categoriesDropdown.classList.remove('show');
            }
        });
    }

    renderCategories();
    renderProducts();

    if (isAdmin) {
        openModalBtn.addEventListener('click', () => {
            openModal();
        });

        openCategoryModalBtn.addEventListener('click', () => {
            categoryForm.reset();
            categoryModal.classList.add('show');
        });

        if (openShopInfoBtn) {
            openShopInfoBtn.addEventListener('click', () => {
                document.getElementById('shop-name-input').value = shopInfo.name;
                document.getElementById('shop-desc-input').value = shopInfo.description;
                shopInfoModal.classList.add('show');
            });
        }

        closeBtn.addEventListener('click', closeModal);
        closeCategoryBtn.addEventListener('click', () => {
            categoryModal.classList.remove('show');
        });
        
        if (closeShopInfoBtn) {
            closeShopInfoBtn.addEventListener('click', () => {
                shopInfoModal.classList.remove('show');
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
            if (e.target === categoryModal) {
                categoryModal.classList.remove('show');
            }
            if (shopInfoModal && e.target === shopInfoModal) {
                shopInfoModal.classList.remove('show');
            }
        });

        // Handle Image Upload using FileReader
        imageInput.addEventListener('change', function() {
            const files = Array.from(this.files);
            
            if (currentImagesBase64.length + files.length > 20) {
                alert("You can only upload up to 20 images per product.");
                this.value = '';
                return;
            }

            files.forEach(file => {
                // Removed the 2MB size limit to allow any sized image to be uploaded

                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        
                        const MAX_SIZE = 800; // Resize large images
                        if (width > height) {
                            if (width > MAX_SIZE) {
                                height *= MAX_SIZE / width;
                                width = MAX_SIZE;
                            }
                        } else {
                            if (height > MAX_SIZE) {
                                width *= MAX_SIZE / height;
                                height = MAX_SIZE;
                            }
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        if (currentImagesBase64.length < 20) {
                            currentImagesBase64.push(canvas.toDataURL('image/jpeg', 0.6)); // Compress with 60% quality
                            showPreview();
                        }
                    };
                    img.src = e.target.result;
                }
                reader.readAsDataURL(file);
            });
            this.value = ''; // Reset input to allow selecting same files again if needed
        });

        // Expose function to remove specific prep image
        window.removePreviewImage = function(index) {
            currentImagesBase64.splice(index, 1);
            showPreview();
        };

        // Handle Product Form Submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const id = document.getElementById('product-id').value;
            const name = document.getElementById('product-name').value;
            const price = document.getElementById('product-price').value;
            const categoryId = document.getElementById('product-category').value;
            
            if (currentImagesBase64.length === 0 && !id) {
                alert('Please select at least one image for the product.');
                return;
            }

            if (id) {
                // Edit existing product
                const index = products.findIndex(p => p.id === id);
                if (index !== -1) {
                    products[index].name = name;
                    products[index].price = price;
                    products[index].categoryId = categoryId;
                    if (currentImagesBase64.length > 0) {
                        products[index].images = currentImagesBase64;
                    }
                }
            } else {
                // Add new product
                const newProduct = {
                    id: generateId(),
                    name: name,
                    price: price,
                    categoryId: categoryId,
                    images: currentImagesBase64
                };
                products.unshift(newProduct);
            }

            saveProducts();
            renderProducts();
            closeModal();
        });

        // Handle Category Form Submit
        categoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('category-name').value;
            const newCategory = {
                id: generateId(),
                name: name
            };
            
            categories.push(newCategory);
            saveCategories();
            renderCategories();
            
            categoryModal.classList.remove('show');
            categoryForm.reset();
        });

        // Handle Shop Info Form Submit
        if (shopInfoForm) {
            shopInfoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newName = document.getElementById('shop-name-input').value;
                const newDesc = document.getElementById('shop-desc-input').value;
                
                shopInfo = {
                    name: newName,
                    description: newDesc
                };
                
                localStorage.setItem('bloomShopInfo', JSON.stringify(shopInfo));
                shopInfoModal.classList.remove('show');
                alert('Shop info successfully saved! Check the user page to see the changes.');
            });
        }
    }

    function generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    function saveProducts() {
        try {
            localStorage.setItem('flowerShopProducts', JSON.stringify(products));
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                alert('Local Storage quota exceeded. Please clear some products or use smaller images.');
            }
        }
    }

    function saveCategories() {
        localStorage.setItem('flowerShopCategories', JSON.stringify(categories));
    }

    function renderCategories() {
        if (!categoriesList) return;
        
        // Render Nav
        let navHtml = `<li class="category-item ${currentCategoryFilter === 'all' ? 'active' : ''}" data-id="all">All Products</li>`;
        
        // Render Select Options
        let selectHtml = `<option value="">Select a Category</option>`;

        categories.forEach(cat => {
            let deleteBtnHtml = isAdmin ? `
                <span class="delete-cat-btn" onclick="event.stopPropagation(); deleteCategory('${cat.id}')">
                    <i class="fa-solid fa-xmark"></i>
                </span>` : '';

            navHtml += `<li class="category-item ${currentCategoryFilter === cat.id ? 'active' : ''}" data-id="${cat.id}">
                            ${cat.name} 
                            ${deleteBtnHtml}
                        </li>`;
            
            selectHtml += `<option value="${cat.id}">${cat.name}</option>`;
        });

        categoriesList.innerHTML = navHtml;
        if (isAdmin && productCategorySelect) {
            productCategorySelect.innerHTML = selectHtml;
        }

        // Attach event listeners to tabs/dropdown items
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Ignore click if it was the delete button
                if(e.target.closest('.delete-cat-btn')) return;
                
                document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                currentCategoryFilter = item.getAttribute('data-id');
                
                if (currentCategoryTitle) {
                    if (currentCategoryFilter === 'all') {
                        currentCategoryTitle.textContent = 'All Products';
                    } else {
                        const targetCat = categories.find(c => c.id === currentCategoryFilter);
                        currentCategoryTitle.textContent = targetCat ? targetCat.name : 'Unknown';
                    }
                }

                if (categoriesDropdown) {
                    categoriesDropdown.classList.remove('show');
                }
                
                renderProducts();
            });
        });
    }

    function renderProducts() {
        if (!productsGrid) return;

        productsGrid.innerHTML = '';
        
        let filteredProducts = products;
        if (currentCategoryFilter !== 'all') {
            filteredProducts = products.filter(p => p.categoryId === currentCategoryFilter);
        }

        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-box-open"></i>
                    <p>No products found. Add your first flower product!</p>
                </div>
            `;
            return;
        }

        filteredProducts.forEach(product => {
            const category = categories.find(c => c.id === product.categoryId);
            const catName = category ? category.name : 'Uncategorized';
            
            let actionsHtml = isAdmin ? `
                <div class="product-actions">
                    <button class="edit-btn" onclick="editProduct('${product.id}')">
                        <i class="fa-solid fa-pen"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="deleteProduct('${product.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            ` : '';

            const displayImage = (product.images && product.images.length > 0) ? product.images[0] : product.image;

            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img-wrapper" style="cursor: pointer;" onclick="openLightbox('${product.id}')">
                    <img src="${displayImage}" alt="${product.name}" class="product-img">
                </div>
                <div class="product-info">
                    <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 500; letter-spacing: 1px; margin-bottom: 0.3rem; display: block;">${catName}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                    ${actionsHtml}
                </div>
            `;
            productsGrid.appendChild(card);
        });
    }

    // Expose functions to global scope for inline onclick handlers
    window.editProduct = function(id) {
        const product = products.find(p => p.id === id);
        if (product) {
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-category').value = product.categoryId || '';
            currentImagesBase64 = [...(product.images || [product.image])]; // Load all images
            
            showPreview();
            modalTitle.textContent = 'Edit Product';
            modal.classList.add('show');
        }
    };

    window.deleteProduct = function(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id !== id);
            saveProducts();
            renderProducts();
        }
    };

    window.deleteCategory = function(id) {
        if (confirm('Are you sure you want to delete this category? Products in this category will become uncategorized.')) {
            categories = categories.filter(c => c.id !== id);
            
            // Remove category from existing products that had it
            products = products.map(p => {
                if (p.categoryId === id) {
                    p.categoryId = '';
                }
                return p;
            });
            
            if (currentCategoryFilter === id) {
                currentCategoryFilter = 'all';
            }
            
            saveCategories();
            saveProducts();
            renderCategories();
            renderProducts();
        }
    };

    function openModal() {
        if (categories.length === 0) {
            alert('Please add at least one category before adding a product.');
            return;
        }
        form.reset();
        document.getElementById('product-id').value = '';
        currentImagesBase64 = [];
        hidePreview();
        modalTitle.textContent = 'Add New Product';
        modal.classList.add('show');
    }

    function closeModal() {
        modal.classList.remove('show');
        form.reset();
    }

    function showPreview() {
        imagePreview.style.display = 'grid';
        imagePreview.innerHTML = '';
        currentImagesBase64.forEach((src, index) => {
            imagePreview.innerHTML += `
                <div class="preview-item">
                    <img src="${src}" alt="Preview">
                    <button type="button" class="preview-remove" onclick="removePreviewImage(${index})"><i class="fa-solid fa-xmark"></i></button>
                </div>
            `;
        });
    }

    function hidePreview() {
        imagePreview.style.display = 'none';
        imagePreview.innerHTML = '';
    }

    // Lightbox Logic
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxThumbnails = document.getElementById('lightbox-thumbnails');
    let lightboxImages = [];
    let currentLightboxIndex = 0;

    window.openLightbox = function(productId) {
        if (!lightboxModal || !lightboxImg) return;
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        lightboxImages = product.images || [product.image];
        if (lightboxImages.length === 0) return;
        
        currentLightboxIndex = 0;
        updateLightboxView();
        lightboxModal.style.display = 'block';
    };

    function updateLightboxView() {
        lightboxImg.src = lightboxImages[currentLightboxIndex];
        
        // Render thumbnails only if there is more than 1 image
        lightboxThumbnails.innerHTML = '';
        if (lightboxImages.length > 1) {
            lightboxImages.forEach((img, index) => {
                const isActive = index === currentLightboxIndex ? 'active' : '';
                lightboxThumbnails.innerHTML += `
                    <img src="${img}" class="lightbox-thumb ${isActive}" onclick="changeLightboxImage(${index})" alt="Thumbnail">
                `;
            });
        }
    }

    window.changeLightboxImage = function(index) {
        currentLightboxIndex = index;
        updateLightboxView();
    };

    if (lightboxModal) {
        document.querySelector('.close-lightbox').addEventListener('click', () => {
            lightboxModal.style.display = 'none';
        });

        document.querySelector('.lightbox-next').addEventListener('click', () => {
            currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
            updateLightboxView();
        });

        document.querySelector('.lightbox-prev').addEventListener('click', () => {
            currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
            updateLightboxView();
        });

        // Close when clicking outside the main image
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.style.display = 'none';
            }
        });
    }
});
