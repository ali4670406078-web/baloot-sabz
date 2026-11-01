
// ================= SUPABASE CONFIG =================

const SUPABASE_URL = "https://jskwrflkgvmbidnmeaof.supabase.co";

// کلید anon فعلی خودت را همین‌جا نگه دار
const SUPABASE_KEY = "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impza3dyZmxrZ3ZtYmlkbm1lYW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzODY0MzgsImV4cCI6MjEwODk2MjQzOH0";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

window.db = db;

// ================= PRODUCT ELEMENTS =================

const productsGrid = document.querySelector(".products-grid");
const filterButtons = document.querySelectorAll(".filter-btn");

// ================= CATEGORY NAMES =================

const categoryNames = {
    arookhori: "اردوخوری",
    paziraei: "پذیرایی",
    decor: "دکوری"
};

// ================= CREATE PRODUCT CARD =================

function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.category = product.category;

    const imageBox = document.createElement("div");
    imageBox.className = "product-image";

    const image = document.createElement("img");
    image.src = product.image_url || "";
    image.alt = product.name;
    image.loading = "lazy";

    imageBox.appendChild(image);

    const info = document.createElement("div");
    info.className = "product-info";

    const category = document.createElement("span");
    category.className = "category";
    category.textContent =
        categoryNames[product.category] || "محصول چوبی";

    const title = document.createElement("h3");
    title.textContent = product.name;

    const description = document.createElement("p");
    description.textContent = product.description || "";

    info.append(category, title, description);
    card.append(imageBox, info);

    return card;
}

// ================= LOAD PRODUCTS =================

async function loadProducts() {
    try {
        const { data, error } = await db
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("خطا در دریافت محصولات:", error.message);
            return;
        }

        // جلوگیری از نمایش دوباره محصولات دیتابیس
        document.querySelectorAll(".database-product").forEach(card => {
            card.remove();
        });

        // اضافه کردن محصولات دیتابیس
        data.forEach(product => {
            const card = createProductCard(product);
            card.classList.add("database-product");
            productsGrid.appendChild(card);
        });

        // اعمال فیلتر فعال
        applyFilter(currentFilter);

        console.log("محصولات با موفقیت دریافت شدند:", data);

    } catch (error) {
        console.error("خطای غیرمنتظره:", error);
    }
}

// ================= FILTER PRODUCTS =================

let currentFilter = "all";

function applyFilter(filter) {
    currentFilter = filter;

    const cards = document.querySelectorAll(".product-card");

    cards.forEach(card => {
        const category = card.dataset.category;

        if (filter === "all" || category === filter) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });

    filterButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === filter
        );
    });
}

// ================= FILTER BUTTON EVENTS =================

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        applyFilter(button.dataset.filter);
    });
});

// ================= START =================

loadProducts();
