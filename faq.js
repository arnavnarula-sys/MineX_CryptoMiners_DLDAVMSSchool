// Toggle FAQ items
function toggleFAQ(element) {
  const faqItem = element.closest('.faq-item');
  
  // Close all other open items in the same category
  const category = element.closest('.faq-category');
  const allItems = category.querySelectorAll('.faq-item');
  
  allItems.forEach(item => {
    if (item !== faqItem) {
      item.classList.remove('active');
    }
  });
  
  // Toggle current item
  faqItem.classList.toggle('active');
}

// Add smooth scroll to FAQ section
document.addEventListener('DOMContentLoaded', () => {
  const exploreBtn = document.querySelector('a[href="#faq-content"]');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const faqSection = document.getElementById('faq-content');
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
});
