const LoadingSpinner = () => {
  return (
    <div className="fixed flex justify-center items-center w-screen h-screen bg-gray-950/70 z-50">
      <div className="flex flex-col items-center">
        <div 
          className="w-16 h-16 border-4 border-blue-500 border-t-4 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;