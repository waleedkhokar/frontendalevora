import React from 'react';
import { motion } from 'framer-motion';

const WhyChooseUs = () => {
    const features = [
        { icon: "✂️", title: "Handcrafted", desc: "Each jacket made by skilled artisans" },
        { icon: "🐂", title: "Genuine Leather", desc: "100% authentic Pakistani leather" },
        { icon: "🚚", title: "Free Delivery", desc: "Across Pakistan in 3-5 days" },
        { icon: "🔄", title: "Easy Returns", desc: "30-day return policy" },
    ];

    return (
        <section className="py-16 bg-gradient-to-r from-[#3E2723] to-[#4E3529] text-[#FFF8E1]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 font-serif">
                    Why Choose LeatherCraft.PK?
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="text-center p-6"
                        >
                            <div className="text-5xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-[#D4AF37]">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;