"use client"

import { Icons } from "@/components/icons"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-16 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-12">
          <div className="max-w-xs">
            <span className="text-2xl font-black text-sky-900 dark:text-white font-headline block mb-4">Falkon Care</span>
            <p className="font-sans text-xs text-slate-500 leading-relaxed mb-3">
              Redefining hygiene standards through technology and professional dedication. Pure Water. Pure Professionalism.
            </p>
            <p className="text-[10px] text-slate-400">
              <span className="font-semibold">Falkon Futurex Private Limited</span>
              <br />
              CIN: U39000DL2025PTC451909
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-widest text-sky-800 dark:text-sky-500 font-headline">Quick Links</h5>
              <ul className="space-y-2 text-xs">
                <li><Link className="text-slate-500 hover:text-sky-500 transition-colors" href="/privacy-policy">Privacy Policy</Link></li>
                <li><Link className="text-slate-500 hover:text-sky-500 transition-colors" href="/terms-of-service">Terms of Service</Link></li>
                <li><Link className="text-slate-500 hover:text-sky-500 transition-colors" href="/about">About Us</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-widest text-sky-800 dark:text-sky-500 font-headline">Services</h5>
              <ul className="space-y-2 text-xs">
                <li><Link className="text-slate-500 hover:text-sky-500 transition-colors" href="/services">Chemical Safety</Link></li>
                <li><Link className="text-slate-500 hover:text-sky-500 transition-colors" href="/services">Tank Restoration</Link></li>
                <li><Link className="text-slate-500 hover:text-sky-500 transition-colors" href="/services">UV Treatment</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-widest text-sky-800 dark:text-sky-500 font-headline">Contact Info</h5>
              <ul className="space-y-2 text-xs">
                <li className="text-slate-500 flex items-center gap-1.5"><Icons.phone className="w-3.5 h-3.5 text-primary" /><a href="tel:+919876543210" className="hover:text-primary">+91 98765 43210</a></li>
                <li className="text-slate-500 flex items-center gap-1.5"><Icons.mail className="w-3.5 h-3.5 text-primary" /><a href="mailto:support@falkoncare.com" className="hover:text-primary">support@falkoncare.com</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200/50">
          <p className="font-sans text-xs text-slate-400">© {new Date().getFullYear()} Falkon Care. Pure Water. Pure Professionalism.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tighter">Powered by CleanTech</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
