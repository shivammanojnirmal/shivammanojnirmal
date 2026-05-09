import React from 'react';
import { ErrorState } from '../components/ui/ErrorState';
import { reportError } from './errorReporter';

export class PageErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        reportError(error, { 
            type: 'page_boundary',
            route: window.location.pathname,
            errorInfo 
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                    <ErrorState 
                        title="Unable to load page"
                        message="There was an issue loading this section of the app."
                        onRetry={() => this.setState({ hasError: false })}
                    />
                    <div className="mt-4">
                        <a href="/" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                            Return to Home
                        </a>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}