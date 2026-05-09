import React from 'react';
import { NavLink } from 'react-router-dom';
import { Phone, MapPin, Clock, Facebook, Instagram, Twitter, ArrowRight } from 'lucide-react';
import { config } from '../../utils/config';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 print-hide">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    
                    {/* Brand Col */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-inner">
                                JM
                            </div>
                            <span className="font-bold text-xl text-white tracking-tight">
                                Jai Mata Di <span className="text-primary-500">Auto Care</span>
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Authorized Ampere EV dealership. We are committed to accelerating the transition to sustainable mobility in Loni Kh. and surrounding areas.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors" aria-label="Facebook">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors" aria-label="Instagram">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors" aria-label="Twitter">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
                        <ul className="space-y-3">
                            {['Vehicles', 'Store', 'Compare', 'Service History', 'Offers'].map(item => (
                                <li key={item}>
                                    <NavLink to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-slate-400 hover:text-primary-400 transition-colors flex items-center group">
                                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 transition-all group-hover:opacity-100 group-hover:ml-0 text-primary-500" />
                                        {item}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Support</h3>
                        <ul className="space-y-3">
                            {['Booking', 'Warranty Check', 'EMI Calculator', 'FAQ', 'Contact Us'].map(item => (
                                <li key={item}>
                                    <NavLink to={`/${item.split(' ')[0].toLowerCase()}`} className="text-slate-400 hover:text-primary-400 transition-colors flex items-center group">
                                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 transition-all group-hover:opacity-100 group-hover:ml-0 text-primary-500" />
                                        {item}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <MapPin className="w-5 h-5 text-primary-500 mr-3 shrink-0 mt-0.5" />
                                <span className="text-slate-400 text-sm">
                                    Loni Kh., Maharashtra, India<br/>
                                    (Near main highway)
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 text-primary-500 mr-3 shrink-0" />
                                <a href={`tel:+${config.waNumber}`} className="text-slate-400 hover:text-primary-400 transition-colors">
                                    +91 98902 02091
                                </a>
                            </li>
                            <li className="flex items-start">
                                <Clock className="w-5 h-5 text-primary-500 mr-3 shrink-0 mt-0.5" />
                                <span className="text-slate-400 text-sm">
                                    Mon–Sat: 9:30 AM – 6:30 PM<br/>
                                    Sunday: Closed
                                </span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>&copy; {currentYear} Jai Mata Di Auto Care. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <NavLink to="/admin" className="hover:text-white transition-colors">Admin Portal</NavLink>
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};