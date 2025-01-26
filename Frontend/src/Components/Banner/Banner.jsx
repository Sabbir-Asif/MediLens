import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, UploadCloud, Stethoscope, BookOpen } from 'lucide-react';

const Banner = () => {
  const navigate = useNavigate();
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleParallax = (e) => {
      if (!parallaxRef.current) return;
      const elements = parallaxRef.current.querySelectorAll('.parallax');
      elements.forEach((el) => {
        const speed = el.getAttribute('data-speed');
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        el.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    };

    document.addEventListener('mousemove', handleParallax);
    return () => document.removeEventListener('mousemove', handleParallax);
  }, []);

  return (
    <div 
      ref={parallaxRef}
      className="relative w-full min-h-screen overflow-hidden bg-[#F0F7FF]"
    >
      {/* Colorful Animated Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute w-full h-full animate-background-flow bg-gradient-to-br from-[#4DA1A9]/10 via-[#79D7BE]/5 to-[#E6A623]/10"></div>
        <div className="absolute w-full h-full animate-background-flow-delayed bg-gradient-to-tr from-[#79D7BE]/10 via-[#4DA1A9]/5 to-[#E6A623]/10"></div>
      </div>

      {/* Soft Color Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#4DA1A9]/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#79D7BE]/10 rounded-full blur-3xl animate-blob-delayed"></div>
      </div>

      {/* Floating Medical Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-float absolute left-20 top-20 parallax" data-speed="2">
          <Stethoscope size={40} className="text-orange-primary opacity-30" />
        </div>
        <div className="animate-float-delayed absolute right-32 top-32 parallax" data-speed="3">
          <FileText size={45} className="text-orange-secondary opacity-30" />
        </div>
        <div className="animate-float-slow absolute bottom-32 left-40 parallax" data-speed="4">
          <UploadCloud size={50} className="text-cream-primary opacity-30" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-4xl">
          {/* Medical Badge */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-primary/10 text-orange-primary rounded-full text-sm font-medium">
              <Stethoscope className="h-4 w-4" />
              AI Medical Report Translator
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-orange-primary via-orange-secondary to-cream-primary bg-clip-text text-transparent animate-gradient">
              Translate Medical Reports
            </span>
            <br />
            <span className="text-gray-800">Instantly in Bangla</span>
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-lg md:text-xl text-gray-600">
            Upload your medical documents and get precise, professional translations. 
            Our AI-powered platform ensures accurate medical terminology and context preservation.
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/upload')}
              className="btn btn-primary bg-gradient-to-r from-orange-primary to-orange-secondary text-white hover:scale-105 transition-transform shadow-lg shadow-orange-primary/30"
            >
              <UploadCloud className="mr-2" /> Upload Report
            </button>
            
            <button
              onClick={() => navigate('/features')}
              className="btn btn-outline btn-primary hover:bg-orange-secondary/10"
            >
              <BookOpen className="mr-2" /> Learn More
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Blob Animations */
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, 50px) scale(1.2); }
        }

        .animate-blob {
          animation: blob 15s ease-in-out infinite;
        }

        .animate-blob-delayed {
          animation: blob 15s ease-in-out 7.5s infinite;
        }

        /* Animated Background Flow */
        @keyframes backgroundFlow {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          50% { transform: translateX(-50px) translateY(30px) rotate(5deg); }
          100% { transform: translateX(0) translateY(0) rotate(0deg); }
        }

        .animate-background-flow {
          animation: backgroundFlow 15s ease-in-out infinite;
        }

        .animate-background-flow-delayed {
          animation: backgroundFlow 15s ease-in-out 7.5s infinite;
        }

        /* Gradient Animation */
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradientFlow 5s ease infinite;
        }

        /* Float Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 6s ease-in-out 1.5s infinite;
        }

        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Banner;