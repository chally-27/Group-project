// SLIDESHOW
let slides = document.querySelectorAll(".slide");
let index = 0;

function showSlides() {
    slides.forEach(slide => slide.classList.remove("active"));
    index++;
    if (index > slides.length) { index = 1 }
    slides[index - 1].classList.add("active");
    setTimeout(showSlides, 3000);
}

showSlides();

// SCROLL TO ORDER
function scrollToOrder() {
    document.getElementById("order").scrollIntoView({ behavior: "smooth" });
}