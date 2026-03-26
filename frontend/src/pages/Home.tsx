import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-orange-50">
            {/* Navbar */}
            <Navbar />

            {/* Hero */}
            <section className="flex flex-col items-center justify-center text-center px-4 py-24">
                <span className="bg-orange-100 text-orange-500 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                    Finding flatmates made simple
                </span>
                <h1 className="text-5xl font-bold text-gray-800 leading-tight mb-4 max-w-2xl">
                    Find your perfect <span className="text-orange-500">flatmate</span> in your city
                </h1>
                <p className="text-gray-500 text-lg max-w-xl mb-8">
                    Swipe, match and chat with people who share your lifestyle, budget and vibe. No awkward cold calls.
                </p>
                <div className="flex items-center gap-4">
                    <Link to="/signup"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl transition text-sm">
                        Find my flatmate
                    </Link>
                    <Link to="/login"
                        className="text-gray-500 hover:text-orange-500 font-medium text-sm transition">
                        I have an account →
                    </Link>
                </div>
            </section>

            {/* How it works */}
            <section className="bg-white py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">How it works</h2>
                    <p className="text-gray-400 text-center text-sm mb-12">Three simple steps to find your flatmate</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Create your profile",
                                desc: "Tell us your budget, city, lifestyle preferences and what you're looking for in a flatmate.",
                                icon: "👤"
                            },
                            {
                                step: "02",
                                title: "Swipe & match",
                                desc: "Browse profiles and swipe right on people you'd like to live with. When they swipe back — it's a match!",
                                icon: "❤️"
                            },
                            {
                                step: "03",
                                title: "Chat & meet",
                                desc: "Start a conversation with your matches. Plan a meet, ask questions, and find your perfect flatmate.",
                                icon: "💬"
                            }
                        ].map((item) => (
                            <div key={item.step} className="flex flex-col items-center text-center p-6 rounded-2xl bg-orange-50">
                                <span className="text-4xl mb-4">{item.icon}</span>
                                <span className="text-orange-300 text-xs font-bold mb-2">{item.step}</span>
                                <h3 className="text-gray-800 font-semibold text-lg mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-4 bg-orange-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Why flatmate?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[
                            { icon: "🏙️", title: "City-wise matching", desc: "Find flatmates in your exact locality and budget range." },
                            { icon: "🎯", title: "Lifestyle filters", desc: "Match with people who share your habits — early riser, non-smoker, pet-friendly and more." },
                            { icon: "💬", title: "In-app chat", desc: "Talk to your matches directly in the app. No sharing numbers until you're comfortable." },
                            { icon: "🔒", title: "Safe & secure", desc: "Your data is protected. You only connect with people you match with." },
                        ].map((f) => (
                            <div key={f.title} className="bg-white rounded-2xl p-6 flex gap-4 shadow-sm">
                                <span className="text-3xl">{f.icon}</span>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">{f.title}</h3>
                                    <p className="text-gray-400 text-sm">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-orange-500 py-20 px-4 text-center">
                <h2 className="text-3xl font-bold text-white mb-3">Ready to find your flatmate?</h2>
                <p className="text-orange-100 text-sm mb-8">Join thousands of people finding their perfect flatmate every day</p>
                <Link to="/signup"
                    className="bg-white text-orange-500 font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition text-sm">
                    Get started for free
                </Link>
            </section>

            {/* Footer */}
            <footer className="bg-white py-6 text-center">
                <p className="text-gray-400 text-sm">
                    Built with ❤️ by Rakshand · flatmate. 2024
                </p>
            </footer>
        </div>
    );
}