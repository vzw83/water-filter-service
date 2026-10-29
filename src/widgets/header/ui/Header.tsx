// @flow
import * as React from 'react';


export const Header = () => {
    return (
        <header className="border-b border-slate-200">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                <a href="#" className="text-xl font-bold tracking-tight">
                    Чистая вода<span className="text-cyan-600">.</span>
                </a>

                <a
                    href="#contacts"
                    className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
                >
                    Связаться с мастером
                </a>
            </div>
        </header>
    );
};