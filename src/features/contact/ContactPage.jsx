import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '../../schemas/contactSchema';
import { submitToSheet } from '../../services/sheets';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { SEOHead } from '../../components/shared/SEOHead';
import { SectionHeader } from '../../components/shared/SectionHeader';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { config } from '../../utils/config';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export const ContactPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(contactSchema)
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await submitToSheet('contacts', {
                ...data,
                id: crypto.randomUUID(),
                date_submitted: new Date().toISOString()
            });
            setIsSubmitted(true);
            toast.success('Message sent! We\'ll get back to you soon.');
            reset();
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full bg-surface-light dark:bg-surface-dark min-h-screen">
            <SEOHead title="Contact Us" description="Get in touch with Jai Mata Di Auto Care for vehicle inquiries, service, and spare parts." />
            
            {/* Simple Map Header */}
            <div className="w-full h-80 bg-slate-200 dark:bg-slate-800 relative">
                {config.mapsEmbedUrl ? (
                    <iframe 
                        src={config.mapsEmbedUrl} 
                        className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all"
                        loading="lazy"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <MapPin className="w-12 h-12 mb-2" />
                    </div>
                )}
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-primary-600 border-none text-white overflow-hidden">
                            <CardBody className="p-8">
                                <h3 className="text-xl font-bold mb-6">Showroom Details</h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-primary-200 mb-1">Address</p>
                                            <p className="text-sm font-medium">Loni Kh., Maharashtra, India (Near main highway)</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-primary-200 mb-1">Phone</p>
                                            <a href={`tel:+${config.waNumber}`} className="text-sm font-medium hover:text-white transition-colors">+91 98902 02091</a>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-primary-200 mb-1">Working Hours</p>
                                            <p className="text-sm font-medium">Mon–Sat: 9:30 AM – 6:30 PM<br/>Sunday: Closed</p>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Quick WhatsApp</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Need an immediate answer? Our team is active on WhatsApp during working hours.</p>
                            <Button 
                                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white"
                                onClick={() => window.open(`https://wa.me/${config.waNumber}`, '_blank')}
                            >
                                Start Chat
                            </Button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-xl">
                            <CardBody className="p-8 sm:p-12">
                                {isSubmitted ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4">Message Received!</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                                            Thank you for reaching out. Our representative will contact you shortly to address your inquiry.
                                        </p>
                                        <Button variant="outline" onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
                                    </motion.div>
                                ) : (
                                    <>
                                        <div className="mb-10">
                                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">Send a Message</h2>
                                            <p className="text-slate-500">Fill out the form below and we'll get back to you within 24 hours.</p>
                                        </div>

                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2">Name</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Your Name" 
                                                        className={`w-full rounded-xl border ${errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500`}
                                                        {...register('name')}
                                                    />
                                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2">Phone</label>
                                                    <input 
                                                        type="tel" 
                                                        placeholder="10-digit Mobile" 
                                                        className={`w-full rounded-xl border ${errors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500`}
                                                        {...register('phone')}
                                                    />
                                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold mb-2">Email (Optional)</label>
                                                <input 
                                                    type="email" 
                                                    placeholder="email@example.com" 
                                                    className={`w-full rounded-xl border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500`}
                                                    {...register('email')}
                                                />
                                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold mb-2">Message</label>
                                                <textarea 
                                                    rows={5}
                                                    placeholder="How can we help you?" 
                                                    className={`w-full rounded-xl border ${errors.message ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 resize-none`}
                                                    {...register('message')}
                                                />
                                                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                                            </div>

                                            <Button 
                                                type="submit" 
                                                size="lg" 
                                                className="w-full"
                                                isLoading={isSubmitting}
                                                rightIcon={<Send className="w-5 h-5" />}
                                            >
                                                Send Message
                                            </Button>
                                        </form>
                                    </>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};