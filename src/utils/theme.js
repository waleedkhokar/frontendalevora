// src/utils/theme.js
export const getThemeClasses = (darkMode) => {
    return {
        // Backgrounds
        bgPrimary: darkMode ? 'bg-black' : 'bg-white',
        bgSecondary: darkMode ? 'bg-gray-900' : 'bg-gray-100',
        
        // Text
        textPrimary: darkMode ? 'text-white' : 'text-black',
        textSecondary: darkMode ? 'text-gray-400' : 'text-gray-600',
        textAccent: darkMode ? 'text-yellow-500' : 'text-black',
        
        // Borders
        border: darkMode ? 'border-gray-800' : 'border-gray-300',
        
        // Buttons
        btnPrimary: darkMode 
            ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
            : 'bg-black text-white hover:bg-gray-800',
            
        btnSecondary: darkMode
            ? 'border-yellow-500 text-yellow-500 hover:bg-yellow-500/10'
            : 'border-black text-black hover:bg-black/10'
    };
};