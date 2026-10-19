document.addEventListener('DOMContentLoaded', () => {
    const logo = document.getElementById('logo-home');
    const projectsGrid = document.getElementById('projects-grid');
    const blogGrid = document.getElementById('blog-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('post-modal');
    const modalDate = document.getElementById('modal-date');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.getElementById('close-modal');

    const scrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderProjects = (filter = 'all') => {
        projectsGrid.innerHTML = '';
        const filtered = filter === 'all'
            ? projects
            : projects.filter(p => p.category === filter);

        filtered.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card reveal';
            card.dataset.category = project.category;
            card.style.transitionDelay = `${index * 0.1}s`;

            const tagsHtml = project.tags
                .map(tag => `<span class="tag">${tag}</span>`)
                .join('');

            card.innerHTML = `
                <div class="project-image">
                    <i class="fa-solid ${project.icon}"></i>
                    <span class="project-status ${project.status.class}">${project.status.label}</span>
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">${tagsHtml}</div>
                </div>
            `;

            projectsGrid.appendChild(card);
        });

        initReveal();
    };

    const renderPosts = () => {
        blogGrid.innerHTML = '';

        posts.forEach((post, index) => {
            const card = document.createElement('article');
            card.className = 'blog-post reveal';
            card.style.transitionDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <span class="blog-date">${post.date}</span>
                <h3>${post.title}</h3>
                <p>${post.shortDesc}</p>
                <span class="read-more">Читать далее <i class="fa-solid fa-arrow-right"></i></span>
            `;

            card.addEventListener('click', () => openModal(post));
            blogGrid.appendChild(card);
        });

        initReveal();
    };

    const openModal = (post) => {
        modalDate.textContent = post.date;
        modalTitle.textContent = post.title;
        modalBody.innerHTML = post.fullText;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    const initReveal = () => {
        const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => observer.observe(el));
    };

    logo.addEventListener('click', scrollToTop);

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(btn.dataset.filter);
        });
    });

    closeButton.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    renderProjects();
    renderPosts();
});
