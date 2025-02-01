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
      className="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-[#F0F7FF] to-[#E8F3FF]"
    >
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute w-full h-full animate-background-flow bg-gradient-to-br from-[#006A4E]/10 via-[#00A550]/5 to-[#DD9933]/10"></div>
        <div className="absolute w-full h-full animate-background-flow-delayed bg-gradient-to-tr from-[#00A550]/10 via-[#006A4E]/5 to-[#DD9933]/10"></div>
      </div>

      {/* Traditional Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-5 pattern-repeat"></div>

      {/* Soft Color Blobs - Using traditional Bangladeshi colors */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#006A4E]/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#DD9933]/10 rounded-full blur-3xl animate-blob-delayed"></div>
      </div>

      {/* Floating Medical Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-float absolute left-20 top-20 parallax" data-speed="2">
          <Stethoscope size={40} className="text-[#006A4E] opacity-30" />
        </div>
        <div className="animate-float-delayed absolute right-32 top-32 parallax" data-speed="3">
          <FileText size={45} className="text-[#DD9933] opacity-30" />
        </div>
        <div className="animate-float-slow absolute bottom-32 left-40 parallax" data-speed="4">
          <UploadCloud size={50} className="text-[#00A550] opacity-30" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-4xl">
          {/* Medical Badge */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#006A4E]/10 text-[#006A4E] rounded-full text-sm font-medium">
              <Stethoscope className="h-4 w-4" />
              চিকিৎসা রিপোর্ট অনুবাদক
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight bangla-font">
            <span className="bg-gradient-to-r from-[#006A4E] via-[#00A550] to-[#DD9933] bg-clip-text text-transparent animate-gradient">
              আপনার চিকিৎসা রিপোর্ট
            </span>
            <br />
            <span className="text-gray-800">সহজ বাংলায় পড়ুন</span>
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-lg md:text-xl text-gray-600 bangla-font">
            আপনার মেডিকেল রিপোর্ট আপলোড করুন এবং সঠিক অনুবাদ পান। 
            আমাদের এআই-চালিত প্ল্যাটফর্ম নির্ভুল চিকিৎসা পরিভাষা এবং বিষয়বস্তু সংরক্ষণ নিশ্চিত করে।
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate('/home/new-chat')}
              className="btn btn-primary bg-gradient-to-r from-[#006A4E] to-[#00A550] text-white hover:scale-105 transition-transform shadow-lg shadow-[#006A4E]/30 bangla-font"
            >
              <UploadCloud className="mr-2" /> রিপোর্ট আপলোড করুন
            </button>
            
            <button
              onClick={() => navigate('/features')}
              className="btn btn-outline border-[#006A4E] text-[#006A4E] hover:bg-[#006A4E]/10 bangla-font"
            >
              <BookOpen className="mr-2" /> আরও জানুন
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Adding Bangla font */
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap');
        
        .bangla-font {
          font-family: 'Noto Sans Bengali', sans-serif;
        }

        /* Existing animations */
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

        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradientFlow 5s ease infinite;
        }

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