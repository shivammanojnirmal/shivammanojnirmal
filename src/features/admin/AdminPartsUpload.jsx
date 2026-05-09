import React, { useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Upload, FileText, CheckCircle, AlertTriangle, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminPartsUpload = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type === 'text/csv') {
            setFile(selected);
        } else {
            toast.error('Please select a valid CSV file');
        }
    };

    const handleUpload = () => {
        if (!file) return;
        setIsUploading(true);
        // Mock upload logic
        setTimeout(() => {
            setIsUploading(false);
            setFile(null);
            toast.success('Parts database updated successfully!');
        }, 2000);
    };

    return (
        <div className="max-w-4xl space-y-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bulk Inventory Upload</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-6">
                    <Card>
                        <CardBody className="p-8">
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center mb-4">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Upload CSV File</h3>
                                <p className="text-sm text-slate-500 mb-6">Select your parts inventory CSV to update the database in bulk.</p>
                                
                                <input 
                                    type="file" 
                                    id="csv-upload" 
                                    accept=".csv" 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                />
                                <label 
                                    htmlFor="csv-upload"
                                    className="cursor-pointer px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-sm font-bold transition-colors mb-4"
                                >
                                    {file ? file.name : 'Select File'}
                                </label>
                                
                                {file && (
                                    <Button className="w-full" isLoading={isUploading} onClick={handleUpload}>
                                        Confirm & Upload
                                    </Button>
                                )}
                            </div>
                        </CardBody>
                    </Card>

                    <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-100 dark:border-amber-800 flex gap-4">
                        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                        <div className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
                            <p className="font-bold mb-1 uppercase tracking-wider">Warning</p>
                            Uploading a CSV will overwrite existing parts with the same ID. Ensure your CSV follows the official template column structure.
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-slate-400" />
                        Upload Requirements
                    </h3>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border shadow-sm">
                        <ul className="space-y-4">
                            {[
                                { label: 'Format', val: 'CSV (Comma Separated)' },
                                { label: 'Columns', val: 'id, name, code, category, model, price, stock, image, featured, description' },
                                { label: 'Image URL', val: 'Must be public URL (Cloudinary/S3)' },
                                { label: 'Categories', val: 'Battery, Motor, Body, Electrical' }
                            ].map((req, i) => (
                                <li key={req.label} className="flex flex-col border-b border-slate-50 dark:border-slate-700/50 pb-3 last:border-0">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{req.label}</span>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{req.val}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8">
                            <Button variant="outline" className="w-full" size="sm">Download Template</Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};