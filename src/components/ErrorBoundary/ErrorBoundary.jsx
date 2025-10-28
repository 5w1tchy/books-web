import { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            requestId: null,
        };
    }

    static getDerivedStateFromError(error) {
        // Extract request ID if it's an API error
        const requestId = error?.requestId || null;
        return {
            hasError: true,
            requestId,
        };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            requestId: null,
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-boundary-content">
                        <h1>უი, რაღაც არასწორად წავიდა!</h1>
                        <p className="error-message">
                            {this.state.error?.message || 'შეცდომა გვერდის ჩატვირთვისას'}
                        </p>

                        {this.state.requestId && (
                            <div className="error-request-id">
                                <small>
                                    Request ID: <code>{this.state.requestId}</code>
                                </small>
                                <p className="error-help-text">
                                    გთხოვთ, შეცდომის შეტყობინებისას მიუთითოთ ეს ID
                                </p>
                            </div>
                        )}

                        {this.state.error?.status === 429 && (
                            <div className="error-rate-limit">
                                <p>🚦 ძალიან ბევრი მოთხოვნა გაიგზავნა</p>
                                <p>გთხოვთ დაელოდოთ რამდენიმე წამს და სცადოთ ხელახლა</p>
                            </div>
                        )}

                        {this.state.error?.status === 413 && (
                            <div className="error-body-size">
                                <p>📦 ფაილი ძალიან დიდია</p>
                                <p>მაქსიმალური ზომა: 10MB</p>
                            </div>
                        )}

                        <div className="error-actions">
                            <button onClick={this.handleReset} className="btn-primary">
                                თავიდან ცდა
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="btn-secondary"
                            >
                                მთავარ გვერდზე დაბრუნება
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                            <details className="error-details">
                                <summary>დეველოპერის ინფორმაცია</summary>
                                <pre>{this.state.errorInfo.componentStack}</pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
