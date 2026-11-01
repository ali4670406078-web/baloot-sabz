const $ = (id) => document.getElementById(id);

let selectedFile = null;

// دسته‌بندی محصولات
const categoryNames = {
    arookhori: "اردوخوری",
    paziraei: "پذیرایی",
    decor: "دکوری"
};

// نمایش تصویر انتخاب‌شده
$("productImage").addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        selectedFile = null;
        $("previewBox").hidden = true;
        return;
    }

    if (!file.type.startsWith("image/")) {
        showMessage("فقط فایل تصویری انتخاب کن.", true);
        this.value = "";
        selectedFile = null;
        $("previewBox").hidden = true;
        return;
    }

    selectedFile = file;

    const reader = new FileReader();

    reader.onload = function (event) {
        $("imagePreview").src = event.target.result;
        $("previewBox").hidden = false;
    };

    reader.readAsDataURL(file);

    showMessage("تصویر انتخاب شد.");
});

// پیام وضعیت
function showMessage(message, error = false) {
    $("statusMessage").textContent = message;

    $("statusMessage").style.color =
        error ? "#a9473e" : "#526b45";
}

// جلوگیری از ورود متن نامعتبر به HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

// تولید کد محصول
$("generateBtn").addEventListener("click", function () {

    const name = $("productName").value.trim();
    const description = $("productDescription").value.trim();
    const category = $("productCategory").value;

    if (!name) {
        showMessage("نام محصول را وارد کن.", true);
        return;
    }

    if (!selectedFile) {
        showMessage("تصویر محصول را انتخاب کن.", true);
        return;
    }

    const imageName = selectedFile.name;
    const safeName = escapeHTML(name);
    const safeDescription = escapeHTML(description);
    const safeImageName = escapeHTML(imageName);

    const categoryLabel = categoryNames[category];

    const html = `<article class="product-card" data-category="${category}">

    <div class="product-image">
        <img src="images/${safeImageName}" alt="${safeName}" loading="lazy">
    </div>

    <div class="product-info">
        <span class="category">${categoryLabel}</span>
        <h3>${safeName}</h3>
        <p>${safeDescription}</p>
    </div>

</article>`;

    $("generatedCode").value = html;

    showMessage("کد محصول با موفقیت ساخته شد!");

});

// کپی کد
$("copyBtn").addEventListener("click", async function () {

    const code = $("generatedCode").value;

    if (!code) {
        showMessage("ابتدا کد محصول را تولید کن.", true);
        return;
    }

    try {
        await navigator.clipboard.writeText(code);
        showMessage("کد با موفقیت کپی شد!");

    } catch (error) {

        $("generatedCode").select();

        const copied = document.execCommand("copy");

        showMessage(
            copied ? "کد کپی شد!" : "کپی خودکار انجام نشد؛ کد را دستی کپی کن.",
            !copied
        );
    }

});