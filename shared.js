// Dynamically load header and footer
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load header
    const headerResponse = await fetch('header.html');
    const headerHTML = await headerResponse.text();
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      headerPlaceholder.innerHTML = headerHTML;
    }

    // Load footer
    const footerResponse = await fetch('footer.html');
    const footerHTML = await footerResponse.text();
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = footerHTML;
    }
  } catch (error) {
    console.error('Error loading header/footer:', error);
  }
});
