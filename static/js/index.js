window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Switch 3D Model
function switchModel(modelName) {
    const modelViewer = document.getElementById('model-viewer');
    const buttons = document.querySelectorAll('.model-switch-btn');
    
    if (modelViewer) {
        // Update model source
        modelViewer.src = `static/3d/${modelName}/3d/${modelName}.glb`;
        
        // Update button active state
        buttons.forEach(btn => {
            if (btn.getAttribute('data-model') === modelName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

// ---------- Fusion Pair Gallery ----------
const fusionPairFolders = [
    '00016N',
    '00024N',
    '00036N',
    '00055D',
    '00123D',
    '00196D'
];

const fusionPairs = fusionPairFolders.map(folder => ({
    folder,
    rgb: `static/images/fusion_pair/${folder}/rgb.png`,
    ir: `static/images/fusion_pair/${folder}/ir.png`,
    sage: `static/images/fusion_pair/${folder}/sage.png`,
    ours: `static/images/fusion_pair/${folder}/ours.png`
}));

const depthModalities = [
    { key: 'vi', dir: 'vi', label: 'VI' },
    { key: 'ir', dir: 'ir', label: 'IR' },
    { key: 'mrfs', dir: 'mrfs', label: 'MRFS' },
    { key: 'sage', dir: 'sage', label: 'SAGE' },
    { key: 'tim', dir: 'timfusion', label: 'TIM' },
    { key: 'ours', dir: 'ours', label: 'OURS' }
];

const depthFilenames = [
    '01194N',
    '01198N',
    '01202N',
    '01206N',
    '01210N',
    '01214N'
];

function chunkArray(items, size) {
    const chunks = [];
    for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size));
    }
    return chunks;
}

function createDepthSlide(filename) {
    const slide = document.createElement('div');
    slide.className = 'depth-slide';

    const grid = document.createElement('div');
    grid.className = 'depth-grid';

    const header = document.createElement('div');
    header.className = 'depth-header-row';
    depthModalities.forEach(mod => {
        const cell = document.createElement('div');
        cell.className = 'depth-mod-label';
        cell.textContent = mod.label;
        header.appendChild(cell);
    });
    grid.appendChild(header);

    const buildRow = type => {
        const row = document.createElement('div');
        row.className = 'depth-row';
        depthModalities.forEach(mod => {
            const cell = document.createElement('div');
            cell.className = 'depth-cell';
            const img = document.createElement('img');
            img.loading = 'lazy';
            img.alt = `${filename} ${mod.label} ${type === 'rgb' ? 'RGB' : 'Depth'}`;
            img.src = `static/3d/${mod.dir}/${type === 'rgb' ? 'rgb' : 'depth'}/${filename}.png`;
            cell.appendChild(img);
            row.appendChild(cell);
        });
        return row;
    };

    grid.appendChild(buildRow('rgb'));
    grid.appendChild(buildRow('depth'));
    slide.appendChild(grid);
    return slide;
}

function createFusionColumn(pair) {
    const column = document.createElement('div');
    column.className = 'column is-6-desktop is-12-tablet';
    column.innerHTML = `
        <div class="fusion-card" data-folder="${pair.folder}">
            <div class="fusion-card-header">
                <span class="fusion-card-title">${pair.folder}</span>
            </div>
            <div class="fusion-slider" data-folder="${pair.folder}" data-split-first="25" data-split-second="50" data-split-third="75">
                <img src="${pair.rgb}" alt="${pair.folder} RGB" class="fusion-layer" data-layer="rgb" draggable="false">
                <img src="${pair.ir}" alt="${pair.folder} IR" class="fusion-layer" data-layer="ir" draggable="false">
                <img src="${pair.sage}" alt="${pair.folder} Sage" class="fusion-layer" data-layer="sage" draggable="false">
                <img src="${pair.ours}" alt="${pair.folder} Ours" class="fusion-layer" data-layer="ours" draggable="false">
                <div class="fusion-handle" data-handle="first" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="25" aria-label="Adjust RGB/IR divider" tabindex="0"></div>
                <div class="fusion-handle" data-handle="second" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-label="Adjust IR/Sage divider" tabindex="0"></div>
                <div class="fusion-handle" data-handle="third" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="75" aria-label="Adjust Sage/Ours divider" tabindex="0"></div>
                <span class="fusion-segment-label fusion-segment-label--rgb">RGB</span>
                <span class="fusion-segment-label fusion-segment-label--ir">IR</span>
                <span class="fusion-segment-label fusion-segment-label--sage">Sage</span>
                <span class="fusion-segment-label fusion-segment-label--ours">Ours</span>
            </div>
        </div>`;

    return column;
}

function initQuadSlider(slider) {
    if (!slider) return;

    const handles = {
        first: slider.querySelector('[data-handle="first"]'),
        second: slider.querySelector('[data-handle="second"]'),
        third: slider.querySelector('[data-handle="third"]')
    };

    if (!handles.first || !handles.second || !handles.third) return;

    const layers = {
        rgb: slider.querySelector('[data-layer="rgb"]'),
        ir: slider.querySelector('[data-layer="ir"]'),
        sage: slider.querySelector('[data-layer="sage"]'),
        ours: slider.querySelector('[data-layer="ours"]')
    };

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const state = {
        first: Number(slider.dataset.splitFirst) || 25,
        second: Number(slider.dataset.splitSecond) || 50,
        third: Number(slider.dataset.splitThird) || 75
    };

    const applyState = () => {
        state.first = clamp(state.first, 0, state.second);
        state.second = clamp(state.second, state.first, state.third);
        state.third = clamp(state.third, state.second, 100);

        slider.dataset.splitFirst = state.first;
        slider.dataset.splitSecond = state.second;
        slider.dataset.splitThird = state.third;

        if (layers.rgb) {
            layers.rgb.style.clipPath = `inset(0 calc(100% - ${state.first}%) 0 0)`;
        }
        if (layers.ir) {
            layers.ir.style.clipPath = `inset(0 calc(100% - ${state.second}%) 0 ${state.first}%)`;
        }
        if (layers.sage) {
            layers.sage.style.clipPath = `inset(0 calc(100% - ${state.third}%) 0 ${state.second}%)`;
        }
        if (layers.ours) {
            layers.ours.style.clipPath = `inset(0 0 0 ${state.third}%)`;
        }

        handles.first.style.left = `${state.first}%`;
        handles.second.style.left = `${state.second}%`;
        handles.third.style.left = `${state.third}%`;

        handles.first.setAttribute('aria-valuenow', Math.round(state.first));
        handles.second.setAttribute('aria-valuenow', Math.round(state.second));
        handles.third.setAttribute('aria-valuenow', Math.round(state.third));
    };

    const getPercent = clientX => {
        const rect = slider.getBoundingClientRect();
        if (rect.width === 0) return 0;
        const percent = ((clientX - rect.left) / rect.width) * 100;
        return clamp(percent, 0, 100);
    };

    let activeHandle = null;

    const updateFromPointer = clientX => {
        if (!activeHandle) return;
        const percent = getPercent(clientX);
        if (activeHandle === 'first') {
            state.first = Math.min(percent, state.second);
        } else if (activeHandle === 'second') {
            state.second = clamp(percent, state.first, state.third);
        } else if (activeHandle === 'third') {
            state.third = Math.max(percent, state.second);
        }
        applyState();
    };

    const endPointer = event => {
        if (!activeHandle) return;
        if (slider.releasePointerCapture) {
            slider.releasePointerCapture(event.pointerId);
        }
        activeHandle = null;
    };

    const startDrag = (handle, event) => {
        activeHandle = handle;
        if (slider.setPointerCapture) {
            slider.setPointerCapture(event.pointerId);
        }
        updateFromPointer(event.clientX);
        event.preventDefault();
    };

    const pickHandle = clientX => {
        const percent = getPercent(clientX);
        const distances = [
            { handle: 'first', value: Math.abs(percent - state.first) },
            { handle: 'second', value: Math.abs(percent - state.second) },
            { handle: 'third', value: Math.abs(percent - state.third) }
        ];
        distances.sort((a, b) => a.value - b.value);
        return distances[0].handle;
    };

    slider.addEventListener('pointerdown', event => {
        const targetHandle = event.target && event.target.dataset ? event.target.dataset.handle : undefined;
        const handleToUse = targetHandle || pickHandle(event.clientX);
        startDrag(handleToUse, event);
    });

    slider.addEventListener('pointermove', event => {
        if (!activeHandle) return;
        updateFromPointer(event.clientX);
        event.preventDefault();
    });

    slider.addEventListener('pointerup', endPointer);
    slider.addEventListener('pointercancel', endPointer);

    Object.values(handles).forEach(handle => {
        handle.addEventListener('keydown', event => {
            if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
            event.preventDefault();
            const delta = (event.key === 'ArrowLeft' || event.key === 'ArrowDown') ? -3 : 3;
            if (handle.dataset.handle === 'first') {
                state.first = clamp(state.first + delta, 0, state.second);
            } else if (handle.dataset.handle === 'second') {
                state.second = clamp(state.second + delta, state.first, state.third);
            } else {
                state.third = clamp(state.third + delta, state.second, 100);
            }
            applyState();
        });
    });

    applyState();
}

function setupFusionCard(column) {
    const slider = column.querySelector('.fusion-slider');
    initQuadSlider(slider);
}

function initDepthGallery() {
    const track = document.getElementById('depthCarouselTrack');
    const dotsContainer = document.getElementById('depthCarouselDots');
    const prevBtn = document.getElementById('depthPrev');
    const nextBtn = document.getElementById('depthNext');
    const filenameLabel = document.getElementById('depthActiveName');

    if (!track || depthFilenames.length === 0) {
        return;
    }

    track.innerHTML = '';
    depthFilenames.forEach(name => {
        const slide = createDepthSlide(name);
        track.appendChild(slide);
    });

    let activeSlide = 0;
    const dots = [];
    const updateFilename = () => {
        if (filenameLabel) {
            filenameLabel.textContent = depthFilenames[activeSlide] || '';
        }
    };

    const goToSlide = index => {
        activeSlide = (index + depthFilenames.length) % depthFilenames.length;
        track.style.transform = `translateX(-${activeSlide * 100}%)`;
        dots.forEach((dot, idx) => {
            if (idx === activeSlide) {
                dot.classList.add('is-active');
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.classList.remove('is-active');
                dot.removeAttribute('aria-current');
            }
        });
        updateFilename();
    };

    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        depthFilenames.forEach((name, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `fusion-dot-btn${index === 0 ? ' is-active' : ''}`;
            dot.setAttribute('aria-label', `Go to depth pair ${name}`);
            if (index === 0) {
                dot.setAttribute('aria-current', 'true');
            }
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            dots.push(dot);
            dotsContainer.appendChild(dot);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(activeSlide - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(activeSlide + 1);
        });
    }

    goToSlide(0);
}

function initFusionGallery() {
    const track = document.getElementById('fusionCarouselTrack');
    const dotsContainer = document.getElementById('fusionCarouselDots');
    const prevBtn = document.getElementById('fusionPrev');
    const nextBtn = document.getElementById('fusionNext');
    const carousel = document.querySelector('.fusion-carousel');

    if (!track || fusionPairs.length === 0) {
        return;
    }

    const groups = chunkArray(fusionPairs, 2);
    track.innerHTML = '';
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
    }

    groups.forEach(group => {
        const slide = document.createElement('div');
        slide.className = 'fusion-carousel-slide';
        const columns = document.createElement('div');
        columns.className = 'columns is-variable is-4 is-multiline';

        group.forEach(pair => {
            const column = createFusionColumn(pair);
            columns.appendChild(column);
            setupFusionCard(column);
        });

        if (group.length === 1) {
            const filler = document.createElement('div');
            filler.className = 'column is-hidden-touch';
            columns.appendChild(filler);
        }

        slide.appendChild(columns);
        track.appendChild(slide);
    });

    let activeSlide = 0;
    const totalSlides = groups.length;
    const dots = [];

    const goToSlide = index => {
        activeSlide = (index + totalSlides) % totalSlides;
        track.style.transform = `translateX(-${activeSlide * 100}%)`;
        dots.forEach((dot, idx) => {
            if (idx === activeSlide) {
                dot.classList.add('is-active');
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.classList.remove('is-active');
                dot.removeAttribute('aria-current');
            }
        });
    };

    if (dotsContainer) {
        groups.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `fusion-dot-btn${index === 0 ? ' is-active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            if (index === 0) {
                dot.setAttribute('aria-current', 'true');
            }
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            dots.push(dot);
            dotsContainer.appendChild(dot);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(activeSlide - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(activeSlide + 1);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    };

    if (window.bulmaCarousel && typeof bulmaCarousel.attach === 'function') {
        bulmaCarousel.attach('.carousel', options);
    }

    if (window.bulmaSlider && typeof bulmaSlider.attach === 'function') {
        bulmaSlider.attach();
    }
    
    setupVideoCarouselAutoplay();
    initFusionGallery();
    initDepthGallery();
});
