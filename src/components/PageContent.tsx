import React from 'react';

const PageContent: React.FC<{ className: string, children: React.ReactNode }> = ({ className, children }) => { 
    return (
        <div className={`${className} bg-blue-600 dark:bg-gray-900 text-gray-900 dark:text-blue-100 w-full min-h-screen`}>
            {children}
        </div>
    );
}

export default PageContent;