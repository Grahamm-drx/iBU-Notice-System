import React from 'react';

const FloatingBlobsAndParticles: React.FC = () => {
  // Blob data from the original HTML
  const blobs = [
    { top: '77%', left: '9%', width: '199px', height: '165px', background: 'white', animationDelay: '1s' },
    { top: '46%', right: '14%', width: '191px', height: '202px', background: 'rgba(255,255,255,0.9)', animationDelay: '3s' },
    { bottom: '6%', left: '63%', width: '195px', height: '150px', background: 'rgba(255,255,255,0.85)', animationDelay: '1s' },
    { top: '31%', right: '28%', width: '160px', height: '229px', background: 'rgba(255,255,255,0.95)', animationDelay: '0s' },
    { bottom: '77%', right: '42%', width: '159px', height: '205px', background: 'white', animationDelay: '9s' },
    { top: '65%', left: '27%', width: '237px', height: '194px', background: 'rgba(255,255,255,0.9)', animationDelay: '1s' },
    { top: '36%', left: '54%', width: '228px', height: '222px', background: 'rgba(255,255,255,0.88)', animationDelay: '8s' },
    { bottom: '85%', right: '53%', width: '184px', height: '180px', background: 'white', animationDelay: '5s' },
    { top: '42%', left: '30%', width: '181px', height: '158px', background: 'rgba(255,255,255,0.92)', animationDelay: '0s' },
    { bottom: '40%', left: '82%', width: '214px', height: '200px', background: 'rgba(255,255,255,0.87)', animationDelay: '9s' },
  ];

  // Particle data (10 particles with different left positions and delays)
  const particles = [
    { left: '5%', delay: '0s' },
    { left: '15%', delay: '1s' },
    { left: '25%', delay: '2s' },
    { left: '35%', delay: '3s' },
    { left: '45%', delay: '4s' },
    { left: '55%', delay: '5s' },
    { left: '65%', delay: '6s' },
    { left: '75%', delay: '7s' },
    { left: '85%', delay: '0.5s' },
    { left: '95%', delay: '1.5s' },
  ];

  return (
    <>
      {/* Inject keyframe animations */}
      <style>{`
        @keyframes blobFloat {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          33% {
            transform: translateY(-120px) translateX(50px) scale(1.2);
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
          66% {
            transform: translateY(80px) translateX(-30px) scale(0.8);
            border-radius: 70% 30% 40% 60% / 30% 70% 60% 40%;
          }
        }
        @keyframes particleFloat {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(100px);
            opacity: 0;
          }
        }
        .blob {
          position: absolute;
          opacity: 0.15;
          animation: blobFloat 25s infinite ease-in-out;
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          opacity: 0;
          animation: particleFloat 8s infinite linear;
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Blobs */}
        {blobs.map((blob, index) => (
          <div
            key={`blob-${index}`}
            className="blob"
            style={{
              top: blob.top,
              left: blob.left,
              right: blob.right,
              bottom: blob.bottom,
              width: blob.width,
              height: blob.height,
              background: blob.background,
              animationDelay: blob.animationDelay,
            }}
          />
        ))}

        {/* Particles */}
        {particles.map((particle, index) => (
          <div
            key={`particle-${index}`}
            className="particle"
            style={{
              left: particle.left,
              animationDelay: particle.delay,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default FloatingBlobsAndParticles;
