import { ChevronLeft, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginHeader = ({
  showBackButton = false,
  showTitle = true,
  onBackClick,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="relative w-full z-20 px-4 sm:px-6 py-3 sm:py-6 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-3">
      {/* 1. Back Button */}
      <div className="flex-1 w-full sm:w-auto flex justify-start">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="flex items-center text-white/80 text-base sm:text-lg font-medium hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-1" /> Back
          </button>
        )}
      </div>

      {/* 2. Title */}
      {showTitle && (
        <div
          className="flex-1 text-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center justify-center">
            
            <span className="text-white">MentorSphere</span>
          </h1>
        </div>
      )}

      {/* 3. Placeholder for alignment */}
      <div className="flex-1 hidden sm:block" />
    </header>
  );
};

export default LoginHeader;
