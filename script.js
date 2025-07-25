// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // ========== USER MANAGEMENT SYSTEM ==========
    const userForm = document.getElementById('user-form');
    const userList = document.getElementById('user-list');
    
    if (userForm && userList) {
      userForm.addEventListener('submit', handleFormSubmit);
      loadUsers();
    }
  
    // Fetch all users from backend
    async function loadUsers() {
      try {
        console.log('Loading users...');
        const response = await fetch('http://localhost:3000/api/users');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const users = await response.json();
        console.log('Received users:', users);
        displayUsers(users);
        
      } catch (error) {
        console.error('Failed to load users:', error);
        if (userList) {
          userList.innerHTML = `<p class="error">Error loading users. Check console.</p>`;
        }
      }
    }
    
    // Display users in the UI
    function displayUsers(users) {
      if (!userList) return;
      
      if (users.length === 0) {
        userList.innerHTML = '<p>No users found.</p>';
        return;
      }
      
      userList.innerHTML = users.map(user => `
        <div class="user-card">
          <h3>${user.name}</h3>
          <p><strong>Email:</strong> ${user.email}</p>
          ${user.age ? `<p><strong>Age:</strong> ${user.age}</p>` : ''}
          <small>Registered: ${new Date(user.registrationDate).toLocaleString()}</small>
        </div>
      `).join('');
    }
    
    // Handle form submission
    async function handleFormSubmit(event) {
      event.preventDefault();
      
      const user = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value || undefined
      };
      
      try {
        console.log('Submitting user:', user);
        
        const response = await fetch('http://localhost:3000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add user');
        }
        
        const newUser = await response.json();
        console.log('User added:', newUser);
        loadUsers();
        userForm.reset();
        
      } catch (error) {
        console.error('Error adding user:', error);
        alert(`Error: ${error.message}`);
      }
    }
  
    // ========== SHOOTING STAR ANIMATION ==========
    const starfallBtn = document.getElementById('starfall-btn');
    let starfallInterval;
  
    function createShootingStar() {
      const star = document.createElement('div');
      star.className = 'shooting-star';
      // Colorful gradient
      const colors = [
        'linear-gradient(180deg, #fff 0%, #8ecfff 80%, transparent 100%)',
        'linear-gradient(180deg, #ff00cc 0%, #00fff7 80%, transparent 100%)',
        'linear-gradient(180deg, #00fff7 0%, #4169e1 80%, transparent 100%)',
        'linear-gradient(180deg, #fff 0%, #ff00cc 80%, transparent 100%)'
      ];
      star.style.background = colors[Math.floor(Math.random() * colors.length)];
      star.style.top = Math.random() * window.innerHeight * 0.7 + 'px';
      star.style.left = Math.random() * window.innerWidth * 0.8 + 'px';
      star.style.boxShadow = '0 0 18px 4px #fff, 0 0 32px 12px #8ecfff, 0 0 24px 8px #ff00cc';
      document.body.appendChild(star);
      setTimeout(() => { star.remove(); }, 1800);
    }
  
    function startShootingStars() {
      if (starfallInterval) clearInterval(starfallInterval);
      
      let duration = 0;
      starfallInterval = setInterval(() => {
        if (duration >= 2000) {
          clearInterval(starfallInterval);
          return;
        }
        createShootingStar();
        duration += 200;
      }, 200);
    }
  
    if (starfallBtn) {
      starfallBtn.addEventListener('click', startShootingStars);
    }
  
    // ========== FETCH DATA FROM BACKEND ==========
    async function getData() {
      try {
        const response = await fetch('http://localhost:3000/api/data');
        const data = await response.json();
        console.log(data);
        displayData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    
    function displayData(data) {
      const resultDiv = document.getElementById('result');
      if (resultDiv) {
        resultDiv.innerHTML = `
          <h3>${data.message}</h3>
          <ul>
            ${data.users.map(user => `<li>${user}</li>`).join('')}
          </ul>
          <p>Status: ${data.status}</p>
        `;
      }
    }
  
    const fetchBtn = document.getElementById('fetch-btn');
    if (fetchBtn) {
      fetchBtn.addEventListener('click', getData);
    }
  
    // ========== REVIEWS SLIDER ==========
    const reviewsTrack = document.querySelector('.reviews-track');
    const reviewCards = document.querySelectorAll('.review-card');
    const prevButton = document.querySelector('.prev-review');
    const nextButton = document.querySelector('.next-review');
    const indicators = document.querySelectorAll('.indicator');
  
    let currentIndex = 0;
    const totalSlides = reviewCards.length;
  
    function updateSlider(index, animate = true) {
      if (!reviewsTrack) return;
      
      currentIndex = index;
      
      if (!animate) {
        reviewsTrack.style.transition = 'none';
      }
      
      requestAnimationFrame(() => {
        reviewsTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        if (!animate) {
          requestAnimationFrame(() => {
            reviewsTrack.style.transition = 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)';
          });
        }
      });
      
      reviewCards.forEach((card, i) => {
        setTimeout(() => {
          card.classList.toggle('active', i === currentIndex);
        }, i * 50);
      });
      
      indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === currentIndex);
      });
      
      if (prevButton) prevButton.disabled = currentIndex === 0;
      if (nextButton) nextButton.disabled = currentIndex === totalSlides - 1;
    }
  
    if (reviewsTrack && prevButton && nextButton) {
      updateSlider(0, false);
      
      prevButton.addEventListener('click', () => {
        if (currentIndex > 0) updateSlider(currentIndex - 1);
      });
  
      nextButton.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1) updateSlider(currentIndex + 1);
      });
      
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
          updateSlider(index);
        });
      });
  
      let autoAdvance = setInterval(() => {
        if (currentIndex < totalSlides - 1) {
          updateSlider(currentIndex + 1);
        } else {
          updateSlider(0);
        }
      }, 5000);
  
      reviewsTrack.addEventListener('mouseenter', () => clearInterval(autoAdvance));
      reviewsTrack.addEventListener('mouseleave', () => {
        autoAdvance = setInterval(() => {
          if (currentIndex < totalSlides - 1) {
            updateSlider(currentIndex + 1);
          } else {
            updateSlider(0);
          }
        }, 5000);
      });
  
      let touchStartX = 0;
      let isDragging = false;
      let startTranslate = 0;
  
      reviewsTrack.addEventListener('touchstart', (e) => {
        isDragging = true;
        touchStartX = e.touches[0].clientX;
        startTranslate = currentIndex * -100;
        reviewsTrack.style.transition = 'none';
      });
  
      reviewsTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const diff = (currentX - touchStartX) / reviewsTrack.offsetWidth * 100;
        const newTranslate = startTranslate - diff;
        
        reviewsTrack.style.transform = `translateX(${newTranslate}%)`;
      });
  
      reviewsTrack.addEventListener('touchend', (e) => {
        isDragging = false;
        const diff = touchStartX - e.changedTouches[0].clientX;
        const threshold = window.innerWidth * 0.2;
        
        reviewsTrack.style.transition = 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)';
        
        if (Math.abs(diff) > threshold) {
          if (diff > 0 && currentIndex < totalSlides - 1) {
            updateSlider(currentIndex + 1);
          } else if (diff < 0 && currentIndex > 0) {
            updateSlider(currentIndex - 1);
          } else {
            updateSlider(currentIndex);
          }
        } else {
          updateSlider(currentIndex);
        }
      });
    }
  
    // ========== MOBILE NAVIGATION ==========
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
  
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
      });
    }
  
    // ========== SMOOTH SCROLLING ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const headerOffset = 100;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
          }
        }
      });
    });
  
    // ========== FORM SUBMISSION ==========
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const button = this.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        button.disabled = true;
        
        setTimeout(() => {
          button.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
          button.classList.add('success');
          
          setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.classList.remove('success');
            this.reset();
          }, 2000);
        }, 1500);
      });
    }
  
    // ========== PARALLAX EFFECTS ==========
    const hero = document.querySelector('.hero');
    if (hero) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
      });
    }
  
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.05;
        aboutImage.style.transform = `translateY(${rate}px)`;
      });
    }
  
    // ========== INTERSECTION OBSERVER ==========
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
  
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
      observer.observe(element);
    });
  
    // ========== VIDEO LAZY LOADING ==========
    document.querySelectorAll('.video-item iframe').forEach(iframe => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const src = iframe.getAttribute('data-src');
            if (src) {
              iframe.src = src;
            }
            observer.unobserve(iframe);
          }
        });
      });
      
      observer.observe(iframe);
    });
  
    // ========== NAVBAR SCROLL EFFECT ==========
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
  
    if (navbar) {
      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
          navbar.classList.remove('scroll-up');
          return;
        }
        
        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
          navbar.classList.remove('scroll-up');
          navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
          navbar.classList.remove('scroll-down');
          navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
      });
    }
  
    // ========== CURSOR ANIMATION ==========
    const cursor = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.custom-cursor-follower');
  
    if (cursor && cursorFollower) {
      document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
          cursorFollower.style.left = e.clientX + 'px';
          cursorFollower.style.top = e.clientY + 'px';
        }, 50);
      });
  
      document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(0.8)';
        cursorFollower.style.transform = 'scale(0.5)';
      });
  
      document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
      });
  
      // Hover effect for interactive elements
      document.querySelectorAll('a, button, .hover-glow').forEach(element => {
        element.addEventListener('mouseenter', () => {
          cursor.style.transform = 'scale(1.5)';
          cursorFollower.style.transform = 'scale(1.5)';
        });
  
        element.addEventListener('mouseleave', () => {
          cursor.style.transform = 'scale(1)';
          cursorFollower.style.transform = 'scale(1)';
        });
      });
    }
  
    // ========== PORTFOLIO ITEM HOVER EFFECT ==========
    document.querySelectorAll('.portfolio-item').forEach(item => {
      item.addEventListener('mouseenter', function(e) {
        const overlay = this.querySelector('.portfolio-overlay');
        if (overlay) {
          const bounds = this.getBoundingClientRect();
          const mouseX = e.clientX - bounds.left;
          const mouseY = e.clientY - bounds.top;
          
          overlay.style.transformOrigin = `${mouseX}px ${mouseY}px`;
        }
      });
    });
  
    // ========== HERO SECTION 3D BACKGROUND (THREE.JS) ==========
    (function() {
      const canvas = document.getElementById('particle-canvas');
      if (!canvas) return;
  
      // Set up renderer
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setClearColor(0x000000, 0); // Transparent background
  
      // Set up scene and camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 50;
  
      // Responsive resize
      function resizeRenderer() {
        const width = canvas.clientWidth || window.innerWidth;
        const height = canvas.clientHeight || window.innerHeight * 0.7;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      window.addEventListener('resize', resizeRenderer);
      resizeRenderer();
  
      // Create a wave mesh
      const geometry = new THREE.PlaneGeometry(80, 40, 80, 40);
      const material = new THREE.MeshPhongMaterial({
        color: 0x1e90ff,
        shininess: 80,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        flatShading: true
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2.5;
      scene.add(mesh);
  
      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(0, 50, 50);
      scene.add(dirLight);
  
      // Animate the wave
      function animateWave(time) {
        const verts = geometry.attributes.position;
        for (let i = 0; i < verts.count; i++) {
          const x = verts.getX(i);
          const y = verts.getY(i);
          verts.setZ(i, Math.sin(x / 4 + time / 900) * Math.cos(y / 4 + time / 1200) * 2.5);
        }
        verts.needsUpdate = true;
      }
  
      // Animation loop
      function animate(time) {
        animateWave(time);
        mesh.rotation.z = Math.sin(time / 4000) * 0.05;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();
    })();
  
    // ========== 3D WATER-LIKE, COLORFUL WAVY BACKGROUND + QUANTUM PARTICLES + ENHANCED STARFALL ========== 
    (function() {
      const canvas = document.getElementById('bg-canvas');
      if (!canvas || typeof THREE === 'undefined') return;
  
      // Set up renderer
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setClearColor(0x000000, 0);
  
      // Scene and camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 18, 70);
  
      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(0, 60, 100);
      scene.add(dirLight);
  
      // Responsive resize
      function resizeRenderer() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      window.addEventListener('resize', resizeRenderer);
      resizeRenderer();
  
      // Water-like wavy mesh with animated color (using vertex colors)
      const geometry = new THREE.PlaneGeometry(160, 80, 120, 60);
      // Assign color attribute for each vertex
      const colors = [];
      for (let i = 0; i < geometry.attributes.position.count; i++) {
        colors.push(0, 0.5, 1); // Initial blue
      }
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
      const material = new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        metalness: 0.3,
        roughness: 0.1,
        transmission: 0.8,
        thickness: 2.0,
        opacity: 0.92,
        transparent: true,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        reflectivity: 0.3,
        side: THREE.DoubleSide,
        sheen: 1.0,
        sheenColor: new THREE.Color(0x00fff7),
        sheenRoughness: 0.2,
        sheenColor: 0x00fff7
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2.5;
      scene.add(mesh);
  
      // Quantum/particle effect: floating glowing particles
      const particleCount = 60;
      const particleGeometry = new THREE.SphereGeometry(0.45, 12, 12);
      const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const particles = [];
      for (let i = 0; i < particleCount; i++) {
        const p = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        p.position.x = (Math.random() - 0.5) * 120;
        p.position.y = 10 + Math.random() * 18;
        p.position.z = (Math.random() - 0.5) * 60;
        p.material.color.setHSL(Math.random(), 0.7, 0.7);
        p.material.transparent = true;
        p.material.opacity = 0.7 + Math.random() * 0.3;
        scene.add(p);
        particles.push(p);
      }
  
      // Animate the wavy mesh and particles
      let isHovering = false;
      function animateWave(time) {
        const verts = geometry.attributes.position;
        const cols = geometry.attributes.color;
        for (let i = 0; i < verts.count; i++) {
          const x = verts.getX(i);
          const y = verts.getY(i);
          // Water wave
          const z = Math.sin(x / 7 + time / 900) * Math.cos(y / 5 + time / 1200) * (isHovering ? 7.5 : 4.5);
          verts.setZ(i, z);
          // Animated color gradient (rainbow effect)
          const hue = 0.55 + 0.25 * Math.sin(time / 2000 + x / 30 + y / 30);
          const rgb = new THREE.Color().setHSL(hue, 0.7, 0.55 + 0.15 * Math.sin(time / 3000 + y / 40));
          cols.setX(i, rgb.r);
          cols.setY(i, rgb.g);
          cols.setZ(i, rgb.b);
        }
        verts.needsUpdate = true;
        cols.needsUpdate = true;
      }
  
      function animateParticles(time) {
        particles.forEach((p, i) => {
          p.position.y += Math.sin(time * 0.001 + i) * 0.02 + 0.03;
          p.position.x += Math.sin(time * 0.0007 + i) * 0.01;
          p.position.z += Math.cos(time * 0.0009 + i) * 0.01;
          if (p.position.y > 28) p.position.y = 10 + Math.random() * 2;
          // Twinkle
          p.material.opacity = 0.6 + 0.4 * Math.abs(Math.sin(time * 0.002 + i));
        });
      }
  
      function animate(time) {
        animateWave(time);
        animateParticles(time);
        mesh.material.emissive = new THREE.Color(isHovering ? 0xff00cc : 0x000000);
        mesh.material.emissiveIntensity = isHovering ? 0.18 : 0.0;
        mesh.rotation.z = Math.sin(time / 4000) * 0.05;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();
  
      // Listen for hover on interactive elements
      document.querySelectorAll('a, button, .hover-glow, .portfolio-item, .service-card, .cta-button').forEach(element => {
        element.addEventListener('mouseenter', () => {
          isHovering = true;
        });
        element.addEventListener('mouseleave', () => {
          isHovering = false;
        });
      });
    })();
  });