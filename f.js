// Enhanced AgriMap Pro JavaScript
class AgriMapPro {
    constructor() {
        this.isLoaded = false;
        this.currentTheme = 'light';
        this.maps = {};
        this.charts = {};
        this.counters = {};
        this.init();
    }

    init() {
        try {
            this.setupEventListeners();
            this.initializeLoading();
            this.initializeAnimations();
            this.initializeMaps();
            this.initializeCharts();
            this.initializeCounters();
            this.initializeTheme();
        } catch (error) {
            console.error('Initialization error:', error);
            // Force completion if there's an error
            const loadingScreen = document.querySelector('.loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
            this.isLoaded = true;
            this.startAnimations();
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });

        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }

        // Mobile menu
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Control buttons
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', this.handleControlButton.bind(this));
        });

        // Tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', this.handleToolAction.bind(this));
        });

        // Scroll events
        window.addEventListener('scroll', this.handleScroll.bind(this));

        // Resize events
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    initializeLoading() {
        const loadingScreen = document.querySelector('.loading-screen');
        const loadingProgress = document.querySelector('.loading-progress');
        
        // Check if elements exist
        if (!loadingScreen || !loadingProgress) {
            console.warn('Loading elements not found, skipping loading screen');
            this.isLoaded = true;
            this.startAnimations();
            return;
        }

        let progress = 0;
        const targetProgress = 100;
        const incrementStep = 2; // More predictable increment
        
        const interval = setInterval(() => {
            progress += incrementStep + Math.random() * 5; // Controlled randomness
            
            if (progress >= targetProgress) {
                progress = targetProgress;
                clearInterval(interval);
                
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    this.isLoaded = true;
                    this.startAnimations();
                }, 500);
            }
            
            loadingProgress.style.width = `${Math.min(progress, 100)}%`;
        }, 100); // Faster updates
    }

    startAnimations() {
        // Start any delayed animations after loading
        document.body.classList.add('loaded');
        
        // Initialize other components
        this.initializeAnimations();
        
        // Trigger any custom animations
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(element => {
            element.classList.add('animate');
        });
    }

    initializeAnimations() {
        // Initialize AOS (Animate On Scroll) if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }

        // Custom animations
        this.initializeFloatingElements();
        this.initializeParticles();
    }

    initializeFloatingElements() {
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 2}s`;
        });
    }

    initializeParticles() {
        // Create animated particles background
        const particles = document.querySelector('.hero-particles');
        if (particles) {
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: floatParticle ${10 + Math.random() * 20}s linear infinite;
                `;
                particles.appendChild(particle);
            }
        }

        // Add particle animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translateY(0px) rotate(0deg);
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);
    }

    initializeMaps() {
        // Initialize Soil Map
        if (document.getElementById('soilMap')) {
            this.maps.soil = L.map('soilMap').setView([20.5937, 78.9629], 6);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.maps.soil);

            // Add enhanced soil markers
            this.addSoilMarkers();
        }

        // Initialize Weather Map
        if (document.getElementById('weatherMap')) {
            this.maps.weather = L.map('weatherMap').setView([20.5937, 78.9629], 6);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.maps.weather);

            // Add enhanced weather markers
            this.addWeatherMarkers();
        }
    }

    addSoilMarkers() {
        const soilData = [
            { lat: 20.5937, lng: 78.9629, ph: 6.8, moisture: 72, nutrients: 85, organic: 78 },
            { lat: 21.1458, lng: 79.0882, ph: 7.2, moisture: 68, nutrients: 78, organic: 82 },
            { lat: 19.0760, lng: 72.8777, ph: 6.5, moisture: 75, nutrients: 82, organic: 75 },
            { lat: 22.5726, lng: 88.3639, ph: 7.0, moisture: 70, nutrients: 88, organic: 80 },
            { lat: 18.5204, lng: 73.8567, ph: 6.9, moisture: 73, nutrients: 79, organic: 77 }
        ];

        soilData.forEach(marker => {
            const soilQuality = (marker.ph + marker.moisture + marker.nutrients + marker.organic) / 4;
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="background: ${this.getSoilColor(soilQuality)}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
                iconSize: [20, 20],
                popupAnchor: [0, -15]
            });

            const soilMarker = L.marker([marker.lat, marker.lng], { icon }).addTo(this.maps.soil);
            soilMarker.bindPopup(`
                <div class="custom-popup">
                    <h4>Soil Analysis</h4>
                    <p><strong>pH Level:</strong> ${marker.ph}</p>
                    <p><strong>Moisture:</strong> ${marker.moisture}%</p>
                    <p><strong>Nutrients:</strong> ${marker.nutrients}%</p>
                    <p><strong>Organic Matter:</strong> ${marker.organic}%</p>
                    <p><strong>Overall Quality:</strong> ${this.getSoilQuality(soilQuality)}</p>
                </div>
            `);
        });
    }

    addWeatherMarkers() {
        const weatherData = [
            { lat: 20.5937, lng: 78.9629, temp: 28, humidity: 65, wind: 12, condition: 'sunny' },
            { lat: 21.1458, lng: 79.0882, temp: 26, humidity: 70, wind: 15, condition: 'cloudy' },
            { lat: 19.0760, lng: 72.8777, temp: 30, humidity: 75, wind: 8, condition: 'rainy' },
            { lat: 22.5726, lng: 88.3639, temp: 25, humidity: 68, wind: 10, condition: 'partly-cloudy' },
            { lat: 18.5204, lng: 73.8567, temp: 29, humidity: 72, wind: 14, condition: 'sunny' }
        ];

        weatherData.forEach(marker => {
            const icon = L.divIcon({
                className: 'weather-marker',
                html: `<div style="background: #3498db; color: white; padding: 5px; border-radius: 10px; font-size: 12px; font-weight: bold;">${marker.temp}°C</div>`,
                iconSize: [40, 20],
                popupAnchor: [0, -15]
            });

            const weatherMarker = L.marker([marker.lat, marker.lng], { icon }).addTo(this.maps.weather);
            weatherMarker.bindPopup(`
                <div class="custom-popup">
                    <h4>Weather Conditions</h4>
                    <p><strong>Temperature:</strong> ${marker.temp}°C</p>
                    <p><strong>Humidity:</strong> ${marker.humidity}%</p>
                    <p><strong>Wind Speed:</strong> ${marker.wind} km/h</p>
                    <p><strong>Condition:</strong> ${marker.condition}</p>
                </div>
            `);
        });
    }

    getSoilColor(quality) {
        if (quality >= 80) return '#2ecc71';
        if (quality >= 60) return '#f39c12';
        if (quality >= 40) return '#e67e22';
        return '#e74c3c';
    }

    getSoilQuality(quality) {
        if (quality >= 80) return 'Excellent';
        if (quality >= 60) return 'Good';
        if (quality >= 40) return 'Fair';
        return 'Poor';
    }

    initializeCharts() {
        // Initialize crop performance chart
        const cropChartCanvas = document.getElementById('cropChart');
        if (cropChartCanvas) {
            const ctx = cropChartCanvas.getContext('2d');
            this.charts.crop = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'Wheat',
                            data: [65, 59, 80, 81, 56, 85],
                            borderColor: '#2ecc71',
                            backgroundColor: 'rgba(46, 204, 113, 0.1)',
                            tension: 0.4
                        },
                        {
                            label: 'Rice',
                            data: [28, 48, 40, 59, 86, 77],
                            borderColor: '#3498db',
                            backgroundColor: 'rgba(52, 152, 219, 0.1)',
                            tension: 0.4
                        },
                        {
                            label: 'Corn',
                            data: [45, 25, 66, 44, 55, 67],
                            borderColor: '#f39c12',
                            backgroundColor: 'rgba(243, 156, 18, 0.1)',
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }

    initializeCounters() {
        const counters = document.querySelectorAll('.counter');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('agrimap-theme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('agrimap-theme', theme);
        
        const themeIcon = document.querySelector('.theme-toggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    handleNavigation(event) {
        event.preventDefault();
        const target = event.currentTarget.getAttribute('href');
        
        // Update active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        // Smooth scroll to section
        if (target.startsWith('#')) {
            const section = document.querySelector(target);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    toggleMobileMenu() {
        const navbar = document.querySelector('.navbar');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        navbar.classList.toggle('mobile-open');
        toggle.classList.toggle('active');
    }

    handleControlButton(event) {
        const button = event.currentTarget;
        const group = button.parentElement;
        
        // Update active state
        group.querySelectorAll('.control-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Handle different map layers or views
        const layer = button.dataset.layer || button.dataset.weather;
        console.log(`Switching to ${layer} view`);
    }

    handleToolAction(event) {
        const tool = event.currentTarget.dataset.tool;
        console.log(`Launching ${tool} tool`);
        
        // Simulate tool launching
        event.currentTarget.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        setTimeout(() => {
            event.currentTarget.innerHTML = '<i class="fas fa-check"></i> Launched!';
            setTimeout(() => {
                const originalContent = this.getOriginalToolContent(tool);
                event.currentTarget.innerHTML = originalContent;
            }, 2000);
        }, 1500);
    }

    getOriginalToolContent(tool) {
        const contents = {
            calculator: '<i class="fas fa-rocket"></i> Launch Calculator',
            schedule: '<i class="fas fa-calendar"></i> View Schedule',
            predictor: '<i class="fas fa-chart-line"></i> Predict Yields',
            monitor: '<i class="fas fa-search"></i> Start Monitoring'
        };
        return contents[tool] || '<i class="fas fa-rocket"></i> Launch Tool';
    }

    handleScroll() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    handleResize() {
        // Resize maps
        Object.values(this.maps).forEach(map => {
            if (map && map.invalidateSize) {
                setTimeout(() => map.invalidateSize(), 100);
            }
        });
        
        // Resize charts
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.agriMapPro = new AgriMapPro();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.agriMapPro) {
        // Refresh data when page becomes visible
        setTimeout(() => {
            window.agriMapPro.handleResize();
        }, 100);
    }
});
