document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimation();
});

function initHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    const frameCount = 251;
    const currentFrame = index => (
        `assets/chaianimation/ezgif-frame-${index.toString().padStart(3, '0')}.png`
    );

    const images = [];
    let loadedImages = 0;
    
    // Set canvas size
    const resizeCanvas = () => {
        if (canvas.parentElement) {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        } else {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawFrame = (index) => {
        if (!images[index]) return;
        const img = images[index];
        
        // Calculate dimensions to cover canvas (like object-fit: cover)
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgRatio;
            offsetY = 0;
            offsetX = (canvas.width - drawWidth) / 2;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Preload frames
    const preloadSequence = async () => {
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            await new Promise((resolve) => {
                img.onload = () => {
                    loadedImages++;
                    images[i] = img;
                    if (i === 1) {
                        drawFrame(1);
                    }
                    resolve();
                };
                img.onerror = () => {
                    console.error("Failed to load frame", i);
                    resolve();
                }
            });
        }
    };

    preloadSequence();

    // Scroll animation logic
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const maxScroll = window.innerHeight; // Animation finishes when scrolled 1 viewport height
        
        // Calculate fraction
        const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));
        
        if (loadedImages > 0) {
            // Map to loaded frames dynamically so it doesn't break if scrolling before full load
            const frameIndex = Math.min(
                loadedImages,
                Math.max(1, Math.floor(scrollFraction * loadedImages) + 1)
            );
            
            requestAnimationFrame(() => drawFrame(frameIndex));
        }
    });
}

