import { useEffect, useRef } from 'react';

interface BubbleOption {
  value: string;
  label: string;
  description: string;
}

interface FloatingBubblesProps {
  options: BubbleOption[];
  selected: string[];
  onToggle: (value: string) => void;
}

interface Bubble {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  label: string;
  description: string;
}

// Helper function to check if a bubble overlaps with existing bubbles
function hasOverlap(x: number, y: number, size: number, bubbles: Bubble[]): boolean {
  for (const bubble of bubbles) {
    const dx = (x + size / 2) - (bubble.x + bubble.size / 2);
    const dy = (y + size / 2) - (bubble.y + bubble.size / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (size + bubble.size) / 2 + 10; // Add 10px padding
    
    if (distance < minDistance) {
      return true;
    }
  }
  return false;
}

export function FloatingBubbles({ options, selected, onToggle }: FloatingBubblesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Initialize bubbles with random positions ensuring no overlap
    bubblesRef.current = [];
    
    options.forEach((option, index) => {
      const size = 80 + Math.random() * 40; // 80-120px
      let x, y;
      let attempts = 0;
      const maxAttempts = 100;

      // Try to find a position that doesn't overlap with existing bubbles
      do {
        x = Math.random() * (rect.width - size);
        y = Math.random() * (rect.height - size);
        attempts++;
      } while (attempts < maxAttempts && hasOverlap(x, y, size, bubblesRef.current));

      bubblesRef.current.push({
        id: option.value,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size,
        label: option.label,
        description: option.description
      });
    });

    const animate = () => {
      const rect = container.getBoundingClientRect();

      bubblesRef.current.forEach(bubble => {
        // Update position
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        // Bounce off walls
        if (bubble.x <= 0) {
          bubble.x = 0;
          bubble.vx = Math.abs(bubble.vx);
        }
        if (bubble.x + bubble.size >= rect.width) {
          bubble.x = rect.width - bubble.size;
          bubble.vx = -Math.abs(bubble.vx);
        }
        if (bubble.y <= 0) {
          bubble.y = 0;
          bubble.vy = Math.abs(bubble.vy);
        }
        if (bubble.y + bubble.size >= rect.height) {
          bubble.y = rect.height - bubble.size;
          bubble.vy = -Math.abs(bubble.vy);
        }

        // Check collisions with other bubbles
        bubblesRef.current.forEach(other => {
          if (bubble.id === other.id) return;

          const dx = (bubble.x + bubble.size / 2) - (other.x + other.size / 2);
          const dy = (bubble.y + bubble.size / 2) - (other.y + other.size / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = (bubble.size + other.size) / 2 + 2; // Add 2px gap

          if (distance < minDistance && distance > 0) {
            // Calculate overlap
            const overlap = minDistance - distance;
            
            // Normalize direction
            const nx = dx / distance;
            const ny = dy / distance;
            
            // Separate bubbles completely to prevent overlap
            const separationX = nx * (overlap / 2 + 0.5);
            const separationY = ny * (overlap / 2 + 0.5);
            
            bubble.x += separationX;
            bubble.y += separationY;
            other.x -= separationX;
            other.y -= separationY;
            
            // Ensure bubbles stay within bounds after separation
            bubble.x = Math.max(0, Math.min(bubble.x, rect.width - bubble.size));
            bubble.y = Math.max(0, Math.min(bubble.y, rect.height - bubble.size));
            other.x = Math.max(0, Math.min(other.x, rect.width - other.size));
            other.y = Math.max(0, Math.min(other.y, rect.height - other.size));
            
            // Calculate relative velocity
            const dvx = bubble.vx - other.vx;
            const dvy = bubble.vy - other.vy;
            
            // Calculate relative velocity in collision normal direction
            const dvn = dvx * nx + dvy * ny;
            
            // Apply collision response (bounce effect)
            if (dvn < 0) {
              const damping = 0.9;
              const impulse = dvn * damping;
              
              bubble.vx -= impulse * nx;
              bubble.vy -= impulse * ny;
              other.vx += impulse * nx;
              other.vy += impulse * ny;
            }
          }
        });

        // Update DOM element
        const element = container.querySelector(`[data-bubble-id="${bubble.id}"]`) as HTMLElement;
        if (element) {
          element.style.transform = `translate(${bubble.x}px, ${bubble.y}px)`;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [options]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl overflow-hidden"
      style={{ height: '500px' }}
    >
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        const bubble = bubblesRef.current.find(b => b.id === option.value);

        return (
          <button
            key={option.value}
            data-bubble-id={option.value}
            onClick={() => onToggle(option.value)}
            className={`absolute rounded-full transition-all duration-300 flex items-center justify-center text-center p-4 cursor-pointer ${
              isSelected
                ? 'bg-blue-600 text-white shadow-xl scale-110'
                : 'bg-white text-gray-700 shadow-lg hover:shadow-xl hover:scale-105'
            }`}
            style={{
              width: `${bubble?.size || 100}px`,
              height: `${bubble?.size || 100}px`,
              willChange: 'transform'
            }}
          >
            <div className="flex flex-col items-center justify-center gap-1">
              <span className={isSelected ? '' : ''}
                style={{ fontSize: bubble && bubble.size > 100 ? '14px' : '12px' }}
              >
                {option.label}
              </span>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center mt-1">
                  <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        );
      })}
      
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
          Выберите один или несколько интересов
        </p>
      </div>
    </div>
  );
}