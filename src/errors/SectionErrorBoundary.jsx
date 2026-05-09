import React from 'react';
import { ErrorState } from '../components/ui/ErrorState';
import { reportError } from './errorReporter';

export class SectionErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        reportError(error, { 
            type: 'section_boundary', 
            section: this.props.sectionName || 'unknown_section',
            errorInfo 
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 my-4">
                    <ErrorState 
                        title="Section Unavailable"
                        message="Failed to load this specific component."
                        onRetry={() => this.setState({ hasError: false })}
                    />
                </div>
            );
        }

        return this.props.children;
    }
}