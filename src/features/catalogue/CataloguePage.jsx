import React, { useState, useEffect } from 'react';
import { fetchSheetData } from '../../services/sheets';
import { SEOHead } from '../../components/shared/SEOHead';
import { SectionHeader } from '../../components/shared/SectionHeader';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileText, Download, ExternalLink, Car } from 'lucide-react';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';

export const CataloguePage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchSheetData('vehicles');
                setVehicles(data || []);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <SEOHead title="Digital Catalogue" description="Download authorized brochures and technical catalogues for all Ampere EV models." />
            
            <SectionHeader 
                title="Digital Showroom" 
                subtitle="High-quality brochures and technical specifications for our complete lineup."
                centered
            />

            <SkeletonTransition loading={loading} skeleton={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({length: 3}).map((_,i) => <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />)}</div>}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vehicles.map(v => (
                        <Card key={v.slug} className="group overflow-hidden">
                            <div className="aspect-video bg-slate-100 dark:bg-slate-900 relative">
                                {v.image && <img src={v.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-bold">{v.name}</h3>
                                    <p className="text-xs text-white/70 uppercase tracking-widest">{v.tier} Series</p>
                                </div>
                            </div>
                            <CardBody className="p-6">
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Download the full technical brochure including dimensions, battery details, and accessory lists.</p>
                                    <div className="flex gap-2">
                                        <Button 
                                            className="flex-1" 
                                            size="sm"
                                            disabled={!v.catalogue_pdf}
                                            onClick={() => v.catalogue_pdf && window.open(v.catalogue_pdf, '_blank')}
                                            leftIcon={<Download className="w-4 h-4"/>}
                                        >
                                            Brochure
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => window.location.href = `/vehicles/${v.slug}`}
                                            leftIcon={<ExternalLink className="w-4 h-4"/>}
                                        >
                                            Details
                                        </Button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}

                    {/* General Service Catalogue */}
                    <Card className="bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-900/30">
                        <CardBody className="p-8 flex flex-col items-center text-center justify-center h-full">
                            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/50 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
                                <FileText className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Owner's Manual</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Download the general maintenance and safety guide for Ampere EVs.</p>
                            <Button variant="outline" className="w-full">Download (PDF)</Button>
                        </CardBody>
                    </Card>
                </div>
            </SkeletonTransition>
        </div>
    );
};