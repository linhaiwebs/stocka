import React, { useState, useEffect, useMemo, useCallback } from 'react';
import * as LucideIcons from 'lucide-react';
import { TemplateProps } from '../../templates/types';
import { useTemplate } from '../contexts/TemplateContext';
import * as Babel from '@babel/standalone';

interface DynamicReactRendererProps {
  componentCode: string;
  templateId: number;
  visitorId: string;
  trafficLinkId?: number;
  trafficData?: {
    id: number;
    name: string;
    url: string;
    source?: string;
    campaign?: string;
  };
}

export function DynamicReactRenderer({
  componentCode,
  templateId,
  visitorId,
  trafficLinkId,
  trafficData,
}: DynamicReactRendererProps) {
  const [error, setError] = useState<Error | null>(null);
  const [ComponentInstance, setComponentInstance] = useState<React.ComponentType<TemplateProps> | null>(null);

  useEffect(() => {
    try {
      // Step 1: Extract component name BEFORE removing exports
      // Strategy 1: Look for "export default ComponentName" pattern
      let componentName: string | null = null;

      const exportDefaultMatch = componentCode.match(/export\s+default\s+(?:function\s+)?([A-Z][a-zA-Z0-9]*)/);
      if (exportDefaultMatch) {
        componentName = exportDefaultMatch[1];
        console.log('Found component name from export default:', componentName);
      }

      // Strategy 2: If no export default, look for function declarations that return JSX
      if (!componentName) {
        // Match function declarations: "function ComponentName" or "const ComponentName = "
        const functionMatches = componentCode.match(/(?:function\s+([A-Z][a-zA-Z0-9]*)|const\s+([A-Z][a-zA-Z0-9]*)\s*=\s*(?:function|\(|async))/g);

        if (functionMatches && functionMatches.length > 0) {
          console.log('Found function matches:', functionMatches);

          // Get all potential component names
          const potentialNames = functionMatches.map(match => {
            const funcMatch = match.match(/function\s+([A-Z][a-zA-Z0-9]*)/);
            if (funcMatch) return funcMatch[1];
            const constMatch = match.match(/const\s+([A-Z][a-zA-Z0-9]*)/);
            if (constMatch) return constMatch[1];
            return null;
          }).filter(Boolean);

          console.log('Potential component names:', potentialNames);

          // Filter out common non-component constants
          const likelyComponents = potentialNames.filter(name => {
            if (!name) return false;
            // Exclude all-caps constants like TICKER_ITEMS, RANKINGS, FAQS
            if (name === name.toUpperCase()) return false;
            // Exclude constants ending with common suffixes
            if (name.endsWith('ITEMS') || name.endsWith('DATA') || name.endsWith('CONFIG') ||
                name.endsWith('STEPS') || name.endsWith('RANKINGS') || name.endsWith('FAQS') ||
                name.endsWith('BENEFITS') || name.endsWith('TESTIMONIALS')) return false;
            return true;
          });

          console.log('Likely components after filtering:', likelyComponents);

          // Use the last likely component (usually the main component)
          if (likelyComponents.length > 0) {
            componentName = likelyComponents[likelyComponents.length - 1] as string;
            console.log('Selected component name from function declaration:', componentName);
          }
        }
      }

      if (!componentName) {
        console.error('Failed to find component name in code:', componentCode.substring(0, 1000));
        throw new Error('Could not find component name. Component must start with capital letter and be exported or be a function declaration.');
      }

      // Step 1.5: Parse Lucide icon imports BEFORE removing them
      const lucideImportMatch = componentCode.match(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/s);
      let requiredIcons: string[] = [];

      if (lucideImportMatch) {
        const importContent = lucideImportMatch[1];
        // Split by comma and clean up whitespace/newlines
        requiredIcons = importContent
          .split(',')
          .map(icon => icon.trim())
          .filter(icon => {
            // Filter out empty strings and React hooks that might be accidentally matched
            if (!icon || icon === '') return false;
            // Ensure it starts with uppercase (icon names are PascalCase)
            if (icon[0] !== icon[0].toUpperCase()) return false;
            // Exclude React hooks (in case someone imports them together)
            if (icon.startsWith('use')) return false;
            return true;
          });

        console.log('Detected Lucide icons from imports:', requiredIcons);

        // Validate that all detected icons exist in LucideIcons
        const availableIcons = Object.keys(LucideIcons);
        const missingIcons = requiredIcons.filter(icon => !availableIcons.includes(icon));
        if (missingIcons.length > 0) {
          console.warn('Warning: Some icons are not available in lucide-react:', missingIcons);
        }
      } else {
        console.log('No lucide-react imports detected in component');
      }

      // Step 2: Comprehensive import/export removal
      let processedCode = componentCode;

      // Remove all import statements (single and multiline)
      processedCode = processedCode.replace(/import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\w+))?\s+from\s+)?['"][^'"]+['"];?\s*/g, '');
      processedCode = processedCode.replace(/import\s+type\s+\{[^}]*\}\s+from\s+['"][^'"]+['"];?\s*/g, '');

      // Remove export statements
      processedCode = processedCode.replace(/export\s+default\s+/g, '');
      processedCode = processedCode.replace(/export\s+\{[^}]*\};?\s*/g, '');
      processedCode = processedCode.replace(/export\s+/g, '');

      console.log('Component name:', componentName);
      console.log('Processed code (after import removal):', processedCode.substring(0, 500));

      // Step 3: Transform JSX to JavaScript using Babel with proper configuration
      const transformResult = Babel.transform(processedCode, {
        presets: [
          ['react', {
            runtime: 'classic',
            pragma: 'React.createElement',
            pragmaFrag: 'React.Fragment'
          }],
          ['typescript', {
            isTSX: true,
            allExtensions: true,
            onlyRemoveTypeImports: true
          }]
        ],
        filename: 'component.tsx',
      });

      if (!transformResult.code) {
        throw new Error('Babel transformation failed to produce code');
      }

      let transformedCode = transformResult.code;

      // Step 4: Post-transformation cleanup - remove any remaining module syntax
      transformedCode = transformedCode.replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '');
      transformedCode = transformedCode.replace(/export\s+default\s+/g, '');
      transformedCode = transformedCode.replace(/export\s+\{[^}]*\};?\s*/g, '');
      transformedCode = transformedCode.replace(/export\s+/g, '');

      // Remove 'use strict' directives if Babel added them (we'll add our own)
      transformedCode = transformedCode.replace(/['"]use strict['"];?\s*/g, '');

      console.log('Transformed code (after Babel):', transformedCode.substring(0, 500));

      // Step 5: Create a safe execution context with all necessary dependencies
      // Generate dynamic icon destructuring based on detected imports
      const iconDestructuring = requiredIcons.length > 0
        ? `const { ${requiredIcons.join(', ')} } = LucideIcons;`
        : '// No Lucide icons needed for this component';

      console.log('Generated icon destructuring:', iconDestructuring);

      const createComponent = new Function(
        'React',
        'useState',
        'useEffect',
        'useMemo',
        'useCallback',
        'LucideIcons',
        'useTemplate',
        'getConfig',
        `
          'use strict';

          // Dynamically destructure only the required Lucide icons
          ${iconDestructuring}

          ${transformedCode}

          // Validate and return the component
          if (typeof ${componentName} === 'undefined') {
            const availableIdentifiers = Object.keys(this).filter(k => k[0] === k[0].toUpperCase());
            throw new Error(
              'Component "${componentName}" was not found. ' +
              'Available identifiers: ' + availableIdentifiers.join(', ')
            );
          }

          if (typeof ${componentName} !== 'function') {
            throw new Error(
              'Component "${componentName}" is not a function (type: ' + typeof ${componentName} + ')'
            );
          }

          return ${componentName};
        `
      );

      // Execute the function with all dependencies
      const Component = createComponent(
        React,
        useState,
        useEffect,
        useMemo,
        useCallback,
        LucideIcons,
        useTemplate,
        () => ({ api: { baseUrl: '' } }) // getConfig placeholder
      );

      if (!Component) {
        throw new Error('Component could not be created from the provided code');
      }

      setComponentInstance(() => Component);
      setError(null);
    } catch (err) {
      console.error('Error creating dynamic component:', err);
      if (err instanceof Error) {
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
        });
      }
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [componentCode]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Component Error</h2>
          <p className="text-slate-600 mb-4">
            Failed to load the component. Please check the component code.
          </p>
          <details className="text-left">
            <summary className="text-sm font-medium text-slate-700 cursor-pointer mb-2">
              Error Details
            </summary>
            <pre className="text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto max-h-48">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  if (!ComponentInstance) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading component...</p>
        </div>
      </div>
    );
  }

  return (
    <ComponentInstance
      templateId={templateId}
      visitorId={visitorId}
      trafficLinkId={trafficLinkId}
      trafficData={trafficData}
    />
  );
}
