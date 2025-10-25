import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Features data
  const features = [
    {
      id: 'submit-claims',
      icon: '🔍',
      title: 'Submit Claims',
      description: 'Share suspicious claims or news snippets for community verification',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'community-voting',
      icon: '🗳️',
      title: 'Community Voting',
      description: 'Upvote or downvote claims based on credibility and evidence',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'evidence-discussion',
      icon: '💬',
      title: 'Evidence-Based Discussion',
      description: 'Provide context, references, and evidence in discussion threads',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'ai-moderation',
      icon: '🤖',
      title: 'AI-Powered Moderation',
      description: 'Advanced AI helps maintain factual and relevant discussions',
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Interactive demos for each feature
  const renderFeatureDemo = () => {
    switch (activeFeature) {
      case 'submit-claims':
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Submit a Claim Demo</h3>
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
              <input 
                type="text" 
                placeholder="Paste suspicious claim here..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
              />
              <input 
                type="text" 
                placeholder="Source URL (optional)"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/submit-claim')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                🚀 Try Real Submission
              </motion.button>
            </div>
          </div>
        );

      case 'community-voting':
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Community Voting Demo</h3>
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
              <p className="text-gray-700 mb-4">"Artificial intelligence will replace all jobs by 2025"</p>
              <div className="flex justify-center space-x-4 mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
                >
                  <span>👍</span>
                  <span>Credible (42)</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
                >
                  <span>👎</span>
                  <span>False (15)</span>
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/claims')}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                🗳️ Explore Real Claims
              </motion.button>
            </div>
          </div>
        );

      case 'evidence-discussion':
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Evidence Discussion Demo</h3>
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
              <div className="space-y-4 mb-4">
                <div className="text-left p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">@ScienceExpert:</p>
                  <p>"According to NASA's official report, this claim is verified with 95% confidence."</p>
                </div>
                <div className="text-left p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">@FactChecker:</p>
                  <p>"Source appears to be satire website. No credible evidence found."</p>
                </div>
              </div>
              <textarea 
                placeholder="Add your evidence or analysis..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500"
                rows="3"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/claims/1')}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                💬 Join Real Discussion
              </motion.button>
            </div>
          </div>
        );

      case 'ai-moderation':
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">AI Moderation Demo</h3>
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span>"This claim is supported by peer-reviewed research"</span>
                  <span className="text-green-600">✅ Approved</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span>"This is fake news! You're all idiots!"</span>
                  <span className="text-red-600">❌ Flagged</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span>"I heard this from a friend..."</span>
                  <span className="text-yellow-600">⚠️ Needs Review</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                AI analyzes content for toxicity, factual accuracy, and relevance in real-time
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                🤖 See AI in Action
              </motion.button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          animate={floatingAnimation}
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"
        />
        <motion.div
          animate={{ ...floatingAnimation, y: [10, -10, 10] }}
          className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20"
        />
        <motion.div
          animate={floatingAnimation}
          className="absolute bottom-20 left-1/3 w-24 h-24 bg-pink-200 rounded-full opacity-20"
        />

        <div className="container mx-auto px-4 py-20 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Fight Misinformation
              </span>
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
            >
              Join the crowd-powered movement to verify claims, share evidence, and promote <span className="font-semibold text-blue-600">truth</span> in the digital age.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/claims"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 block"
                >
                  🔍 Browse Claims
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/submit-claim"
                  className="bg-white text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 block"
                >
                  📢 Submit a Claim
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
            >
              {[
                { number: '10K+', label: 'Claims Verified' },
                { number: '50K+', label: 'Community Members' },
                { number: '95%', label: 'Accuracy Rate' },
                { number: '24/7', label: 'Active Moderation' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Click on each feature to see it in action right here!
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -10
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFeature(feature.id)}
                className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 cursor-pointer ${
                  activeFeature === feature.id ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-100'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className={`text-4xl mb-4 w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg`}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Interactive Demo Area */}
          <AnimatePresence mode="wait">
            {activeFeature && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                className="mt-12 max-w-4xl mx-auto"
              >
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
                  {renderFeatureDemo()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of truth-seekers in the fight against misinformation. Together, we can create a more informed world.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/register"
              className="bg-white text-blue-600 px-12 py-4 rounded-xl font-bold text-lg shadow-2xl hover:bg-gray-100 transition-colors inline-block"
            >
              Join VeriCrowd Today
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;