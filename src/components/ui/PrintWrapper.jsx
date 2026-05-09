import React from 'react';

export const PrintWrapper = ({ children }) => {
    return (
        <div className="print-show hidden">
            <div className="print-wrapper-header">
                <h1>Jai Mata Di Auto Care</h1>
                <p>Authorized Ampere EV Partner | Loni Kh., Maharashtra</p>
                <p>Phone: +91 9890202091</p>
            </div>
            {children}
        </div>
    );
};