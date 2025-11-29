"use client";

interface LoadingScreenProps {
    progress: number;
}

export const LoadingScreen = ({ progress }: LoadingScreenProps) => {
    return (
        <div className="fixed inset-0 bg-linear-to-br from-gray-950 to-gray-800 flex flex-col items-center justify-center  text-white z-50 transition-opacity duration-500">
          
            {/* Animated Spinner */}
            <div className="w-16 h-16 border-4 border-gray-600 border-t-orange-400 rounded-full animate-spin mb-8" />

            {/* Title */}
            <h1 className="text-4xl font-light mb-8 bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                3D Portfolio
            </h1>

            {/* Progress Section */}
            <div className="w-80 mb-4 px-2">
                {/* Progress Info */}
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Loading 3D Models...</span>
                    <span>{Math.round(progress)}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-linear-to-r from-orange-500 to-yellow-400 rounded-full transition-all duration-300 ease-out shadow-lg shadow-blue-500/50"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Loading Text */}
            <p className="text-sm text-gray-500 text-center max-w-md mt-4">
                Preparing interactive 3D experience...
            </p>

            {/* Loading Steps */}
            <div className="mt-6 flex gap-4 text-xs text-gray-500">
                <span className={progress >= 33 ? 'text-green-400' : ''}>✓ Models</span>
                <span className={progress >= 66 ? 'text-green-400' : ''}>✓ Textures</span>
                <span className={progress >= 100 ? 'text-green-400' : ''}>✓ Animations</span>
            </div>
            
        </div>
    );
};