import React from 'react';
import { Link } from 'react-router-dom';

interface GlobalFooterProps {
  domainName?: string;
  copyrightText?: string;
}

export function GlobalFooter({ domainName, copyrightText }: GlobalFooterProps) {
  const currentYear = new Date().getFullYear();
  const displayCopyright = copyrightText || `© ${currentYear} ${domainName || 'All rights reserved'}`;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col items-center justify-center space-y-3 md:space-y-4">
          <p className="text-sm md:text-base text-center">{displayCopyright}</p>
          <div className="flex items-center space-x-4 md:space-x-6">
            <Link
              to="/privacy-policy"
              className="text-sm md:text-base hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              to="/terms-of-service"
              className="text-sm md:text-base hover:text-white transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
