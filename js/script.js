document.getElementById('hamburger').addEventListener('click', function() {
    const navList = document.querySelector('nav .nav-list');
    navList.style.display = navList.style.display === 'block' ? 'none' : 'block';
});
